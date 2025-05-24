import VisitorsService from "../services/visitorsService.js";

class VisitorsController {
  static async addVisitor(req, res) {
    const visitorId = req.params.visitorId;

    if (!visitorId) {
      return res.status(400).json({ error: "Bad request." });
    }

    const parsedVisitorId = Number(visitorId);

    if (isNaN(parsedVisitorId)) {
      return res.status(400).json({ error: "Bad request." });
    }

    VisitorsService.addVisitor(visitorId);

    return res.status(201).json({ message: "Visitor was created." });
  }
}

export default VisitorsController;
