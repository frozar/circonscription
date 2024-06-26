import { DeputeType, DeputesType, LayerIdCircoType } from "./type";

const layerToDepute: { [key: LayerIdCircoType]: DeputeType } = {};

export function findLayerDepute(
  featureProperties: { id_circo: string; dep: string },
  deputes: DeputesType
) {
  const { id_circo: layerIdCirco, dep: layerNumDep } = featureProperties;

  const layerNumCirco = +layerIdCirco.replace(layerNumDep, "");

  const candidateDepute = layerToDepute[layerIdCirco];

  if (candidateDepute) {
    return candidateDepute;
  } else {
    let resDepute;
    for (const depItem of deputes) {
      // console.log("depItem.depute", depItem.depute);
      const { num_deptmt, num_circo } = depItem.depute;
      // console.log("num_deptmt", num_deptmt);
      // console.log("num_circo", num_circo);
      if (num_deptmt === layerNumDep && num_circo === layerNumCirco) {
        // console.log("res", depItem.depute);
        resDepute = depItem.depute;
        layerToDepute[layerIdCirco] = resDepute;
        break;
      }
    }

    return resDepute;
  }
}
