import { isBoolean } from "util";
import { IRMPorcent, IRMDepen, IRMDeducao, IRMInss } from "../enums/IRMNum";
import { IRM } from "../models/IRM";

class IRMensalService {
  async calcularIRM(IRMF: IRM) {
    if (
      IRMF.salarioBruto <= 0 ||
      IRMF.pensao < 0 ||
      isNaN(IRMF.salarioBruto) ||
      isNaN(IRMF.pensao) ||
      isNaN(IRMF.dependentes) ||
      isBoolean(IRMF.dependentes) ||
      isBoolean(IRMF.salarioBruto) ||
      isBoolean(IRMF.pensao)
    ) {
      throw Error;
    }

    function calculoInss(IRMF: IRM) {
      let valor = 0;
      let calculated = false;

      if (IRMF.salarioBruto <= 1100) {
        valor += IRMF.salarioBruto * IRMInss.FIRST_PERCENT;
        calculated = true;
      } else if (!calculated) {
        valor = 1100 * IRMInss.FIRST_PERCENT;
      }

      if (IRMF.salarioBruto <= 2203.48 && !calculated) {
        valor += (IRMF.salarioBruto - 1100.01) * IRMInss.SECOND_PERCENT;
        calculated = true;
      } else if (!calculated) {
        valor += (2203.48 - 1100.01) * IRMInss.SECOND_PERCENT;
      }

      if (IRMF.salarioBruto <= 3305.22 && !calculated) {
        valor += (IRMF.salarioBruto - 2203.49) * IRMInss.THIRD_PERCENT;
        calculated = true;
      } else if (!calculated) {
        valor += (3305.22 - 2203.49) * IRMInss.THIRD_PERCENT;
      }

      if (IRMF.salarioBruto <= 6433.57 && !calculated) {
        valor += (IRMF.salarioBruto - 3305.23) * IRMInss.FOURTY_PERCENT;
        calculated = true;
      } else if (!calculated) {
        valor += (6433.57 - 3305.23) * IRMInss.FOURTY_PERCENT;
      }
      return valor;
    }

    const inss = calculoInss(IRMF);
    const baseSalarial =
      IRMF.salarioBruto -
      inss -
      IRMF.pensao -
      IRMF.dependentes * IRMDepen.dependentes;
    IRMF.INSS = Number(inss.toFixed(2));

    if (baseSalarial <= 1903.98) {
      IRMF.resultadoIRM = baseSalarial * IRMPorcent.ZERO_RANGE;
    } else if (baseSalarial >= 1903.99 && baseSalarial <= 2826.65) {
      IRMF.resultadoIRM =
        baseSalarial * IRMPorcent.FIRST_RANGE -
        Number(IRMDeducao.FIRST_DEDUCTION.toFixed(2));
    } else if (baseSalarial >= 2826.66 && baseSalarial <= 3751.05) {
      IRMF.resultadoIRM =
        baseSalarial * IRMPorcent.SECOND_RANGE -
        Number(IRMDeducao.SECOND_DEDUCTION.toFixed(2));
    } else if (baseSalarial >= 3751.06 && baseSalarial <= 4664.68) {
      IRMF.resultadoIRM =
        baseSalarial * IRMPorcent.THIRD_RANGE -
        Number(IRMDeducao.THIRD_DEDUCTION.toFixed(2));
    } else {
      IRMF.resultadoIRM =
        baseSalarial * IRMPorcent.FOURTY_RANGE -
        Number(IRMDeducao.FOURTY_DEDUCTION.toFixed(2));
    }

    return Number(IRMF.resultadoIRM.toFixed(2));
  }
}

export { IRMensalService };
