const Depinterest = artifacts.require("./Depinterest.sol");
let BN = web3.utils.BN;

const getErrorObj = (obj = {}) => {
  const txHash = Object.keys(obj)[0];
  return obj[txHash];
};

const uploadFirstImage = async (instance, tx = {}) => {
    await instance.uploadImage(
        "https://images.hdqwalls.com/wallpapers/doge-to-the-moon-05.jpg", 
        "Doge coin is the best. Wohhooo!",
        tx  
    );
};

const uploadSecondImage = async (instance, tx = {}) => {
    await instance.uploadImage(
        "https://themarketperiodical.com/wp-content/uploads/2021/08/s2-3.jpg", 
        "Solana is the future folks.",
        tx  
    );
};

const ERR_INVALID_ID = "Image id is invalid.";
const ERR_EMPTY_DESCRIPTION= "Image should have some description.";
const ERR_EMPTY_URL= "Image Url should exist";
const ERR_NOT_OWNER = "Ownable: caller is not the owner";
const AMOUNT = 0.3e18;
const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

contract("Depinterest", function (accounts) {
  const [owner, alice] = accounts;
  beforeEach(async () => {
    instance = await Depinterest.new();
    await uploadFirstImage(instance, { from: owner });
    await uploadSecondImage(instance, { from: owner });
  });

  /**
   * Checks that the contract inherits OpenZeppelin Ownable by using owner()
   */
  it("should be owned by the owner using OpenZeppelin Ownable", async () => {
    instance = await Depinterest.new();
    assert.strictEqual(await instance.owner(), owner);
  });

  describe("uploadImage()", () => {
    /**
     * Attemps to upload an image with empty url.
     */
    it("should fail if the image url is empty", async () => {
      try {
        await instance.uploadImage("", "Some description");
      } catch (e) {
        const { error, reason } = getErrorObj(e.data);
        assert.equal(error, "revert");
        assert.equal(reason, ERR_EMPTY_URL);
      }
    });

    /**
     * Attemps to upload an image with empty description.
     */
    it("should fail if the image description is empty", async () => {
        try {
            await instance.uploadImage("http://abc.jpg", "");
        } catch (e) {
            const { error, reason } = getErrorObj(e.data);
            assert.equal(error, "revert");
            assert.equal(reason, ERR_EMPTY_DESCRIPTION);
        }
    });

    /**
     * Should upload the image successfully.
     */
    it("should upload the image successfully", async () => {
        const IMAGE_ID = 1;
        const result = await instance.getImage(IMAGE_ID);
        let length = await instance.getImageCount();
        assert.equal(length, 2);  
        assert.equal(result[1].toString(), "https://images.hdqwalls.com/wallpapers/doge-to-the-moon-05.jpg");
        assert.equal(result[2].toString(), "Doge coin is the best. Wohhooo!");

        let eventEmitted = false;
        const tx = await instance.uploadImage("http://abc.xyz", "Dummy description");
        length = await instance.getImageCount();
        assert.equal(length, 3);  
        if(tx.logs[0].event == "ImageUploaded") {
            eventEmitted = true;
        }

        assert.equal(eventEmitted, true, "Uploading an image should emit an ImageUploaded event");
    });
  });

  describe("tipImageOwner()", () => {
    /**
     * Attemps to upload an image with invalid id.
     */
    it("should fail if the image id is invalid", async () => {
      try {
        await instance.tipImageOwner(0);
      } catch (e) {
        const { error, reason } = getErrorObj(e.data);
        assert.equal(error, "revert");
        assert.equal(reason, ERR_INVALID_ID);
      }
    });

    /**
     * Should tip the image owner successfully.
     */
    it("should tip the image owner successfully", async () => {
        const IMAGE_ID = 1;
        const ownerBalanceBefore = await web3.eth.getBalance(owner);
        const aliceBalanceBefore = await web3.eth.getBalance(alice);
        const tx = await instance.tipImageOwner(IMAGE_ID, {
            from: alice,
            value: AMOUNT
        });
        const eventEmitted = tx.logs[0].event == "ImageTipped";
        assert.ok(eventEmitted, "tipping an image should emit an ImageTipped event");
        const ownerBalanceAfter = await web3.eth.getBalance(owner);
        const aliceBalanceAfter = await web3.eth.getBalance(alice);
        assert.equal(
            new BN(ownerBalanceAfter).toString(),
            new BN(ownerBalanceBefore)
              .add(new BN(AMOUNT.toString()))
              .toString(),
            "owner's balance should be increased by the tip amount"
        );
    });
  });

  it("does not let new 'write' functions go through if the contract is paused", async () => {
    await instance.pause({
      from: owner,
    });
    let paused = await instance.paused({
      from: owner,
    });
    assert.ok(paused, "Contract should be paused");
    try {
      await instance.uploadImage("http://abc.xyz", "Dummy description", {
        from: owner,
      });
      assert.ok(false, "It didn't throw an axception");
    } catch (e) {
      assert.ok(
        e.toString().includes("Pausable: paused"),
        "Needs to fail because the contract is paused"
      );
    }
    await instance.unpause({
      from: owner,
    });
    paused = await instance.paused({
      from: owner,
    });
    assert.ok(!paused, "Contract should be unpaused");
    await instance.uploadImage("http://abc.xyz", "Dummy description", {
        from: owner,
    });
  });

  it("does not let the user pause/unpause twice", async () => {
    await instance.pause({
      from: owner,
    });
    try {
      await instance.pause({
        from: owner,
      });
      assert.ok(false, "It didn't throw an axception");
    } catch (e) {
      assert.ok(
        e.toString().includes("Pausable: paused"),
        "Needs to fail because the contract is paused"
      );
    }
    await instance.unpause({
      from: owner,
    });
    try {
      await instance.unpause({
        from: owner,
      });
      assert.ok(false, "It didn't throw an axception");
    } catch (e) {
      assert.ok(
        e.toString().includes("Pausable: not paused"),
        "Needs to fail because the contract is not paused"
      );
    }
  });

  it("does not let the non-owner pause/unpause", async () => {
    try {
      await instance.pause({
        from: alice,
      });
      assert.ok(false, "It didn't throw an axception");
    } catch (e) {
      assert.ok(
        e.toString().includes("caller is not the owner"),
        "Needs to fail because owner is requred"
      );
    }

    try {
      await instance.unpause({
        from: alice,
      });
      assert.ok(false, "It didn't throw an axception");
    } catch (e) {
      assert.ok(
        e.toString().includes("caller is not the owner"),
        "Needs to fail because owner is requred"
      );
    }
  });
});