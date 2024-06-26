type PartiRattFinancierType = string;

export type DeputeType = {
  num_deptmt: string;
  nom_circo: string;
  num_circo: number;
  mandat_debut: string;
  mandat_fin: string;
  groupe_sigle: string;
  parti_ratt_financier: PartiRattFinancierType;
  nom: string;
  profession: string;
};

export type DeputesType = Array<{
  depute: DeputeType;
}>;

export type LegendType = { [key: PartiRattFinancierType]: string };

export type LayerIdCircoType = string;
