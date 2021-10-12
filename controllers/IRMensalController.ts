import { IRM } from "../models/IRM";
import { IRMensalService } from "../services/IRMensalService";

class IRMensalController {
  async calcularIRM(req, res) {
    const { salarioBruto, pensao, dependentes } = req.body;

    try {
      let IRModel = new IRM();
      IRModel.salarioBruto = salarioBruto;
      IRModel.pensao = pensao;
      IRModel.dependentes = dependentes;

      const irnafonteService = new IRMensalService();
      IRModel.resultadoIRM = await irnafonteService.calcularIRM(IRModel);

      return res.send({ IRModel });
    } catch (e) {
      res.status(400).json({
        error: "O dado inserido está incorreto, tente novamente por favor!",
      });
    }
  }
}

export { IRMensalController };
