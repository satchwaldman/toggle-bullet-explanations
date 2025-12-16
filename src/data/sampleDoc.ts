import type { Chunk } from '../ExpandableText';

export const sampleDoc: Chunk[] = [
  "An ",
  {
    word: "NPN transistor",
    id: "npn",
    expansion: [
      "A three-layer ",
      { word: "semiconductor", id: "semi", expansion: [
        "A material with electrical ",
        { word: "conductivity", id: "conductivity", expansion: [] },
        " between a conductor and insulator. ",
        { word: "Silicon", id: "silicon", expansion: [] },
        " is the most common example."
      ] },
      " sandwich: n-type, p-type, n-type. The middle p-layer is the ",
      { word: "base", id: "base", expansion: [
        "The thin middle layer. When ",
        { word: "forward-biased", id: "fwd-bias", expansion: [] },
        ", it allows electrons to flow through the transistor."
      ] },
      "."
    ]
  },
  " is a ",
  {
    word: "current-controlled switch",
    id: "ccs",
    expansion: [
      "A small ",
      { word: "current", id: "current", expansion: [
        "The flow of ",
        { word: "electric charge", id: "charge", expansion: [] },
        ", measured in ",
        { word: "amperes", id: "amps", expansion: [] },
        "."
      ] },
      " into the base controls a larger current from ",
      { word: "collector", id: "collector", expansion: [
        "The n-type layer that receives electrons from the base. Connected to the positive side of the power supply."
      ] },
      " to ",
      { word: "emitter", id: "emitter", expansion: [
        "The n-type layer that supplies electrons. Connected to ground or negative side."
      ] },
      "."
    ]
  },
  ": a small current into the base allows a larger current to flow from collector to emitter."
];

