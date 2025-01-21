const router = require("express").Router();
const CampaignController = require("../controllers/campaignController");
const authentication = require("../middleware/middleware.auth");


router.post("/", authentication, CampaignController.createCampaign);
router.get("/", authentication, CampaignController.getAllCampaigns);
router.get("/:id", authentication, CampaignController.getCampaignById);
router.put("/:id", authentication, CampaignController.updateCampaign);
router.delete("/:id", authentication, CampaignController.deleteCampaign);

module.exports = router;
