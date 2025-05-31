import VisitorsService from "../services/visitorsService.js";

class VisitorsController {
  static async addVisitor(req, res, next) {
    const { visitorId } = req.body;

    if (!visitorId) {
      return res.status(400).json({ error: "Bad request." });
    }

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(visitorId)) {
      return res.status(400).json({ error: "Bad request." });
    }

    try {
      await VisitorsService.addVisitor(visitorId);
    } catch (e) {
      return next(e);
    }

    return res.status(201).json({ message: "Visitor was created." });
  }

  static async submitEmail(req, res, next) {
    const { visitorId, email } = req.body;

    if (!visitorId || !email) {
      return res.status(400).json({ error: "Bad request." });
    }

    try {
      await VisitorsService.addVisitorEmail(visitorId, email);
    } catch (e) {
      return next(e);
    }

    return res
      .status(200)
      .json({ message: "Email form has been successfully submited." });
  }
}

export default VisitorsController;
