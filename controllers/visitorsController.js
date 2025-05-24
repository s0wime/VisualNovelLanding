import VisitorsService from "../services/visitorsService.js";

class VisitorsController {
  static async addVisitor(req, res, next) {
    const { visitorId } = req.query;

    if (!visitorId) {
      return res.status(400).json({ error: "Bad request." });
    }

    try {
      await VisitorsService.addVisitor(visitorId);
    } catch (e) {
      next(e);
    }

    return res.status(201).json({ message: "Visitor was created." });
  }
}

export default VisitorsController;
