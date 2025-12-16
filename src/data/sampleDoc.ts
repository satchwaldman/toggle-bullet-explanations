import type { Chunk } from '../ExpandableText';

export const sampleDoc: Chunk[] = [
  "An ",
  {
    word: "NPN transistor",
    id: "npn",
    expansion: [
      "A three-layer ",
      { word: "semiconductor", id: "semi", expansion: [
        {
            word: "semiconductor",
            id: "semi",
            expansion: [
              "A material with electrical ",
              { word: "conductivity", id: "conductivity", expansion: [] },
              " between a conductor and insulator. ",
              { word: "Silicon", id: "silicon", expansion: [] },
              " is the most common example."
            ]
          }
      ] },
      " sandwich: n-type, p-type, n-type. The middle p-layer is the ",
      { word: "base", id: "base", expansion: [] },
      "."
    ]
  },
  " is a ",
  {
    word: "current-controlled switch",
    id: "ccs",
    expansion: [
      "A small ",
      { word: "current", id: "current", expansion: [] },
      " into the base controls a larger current from ",
      { word: "collector", id: "collector", expansion: [] },
      " to ",
      { word: "emitter", id: "emitter", expansion: [] },
      "."
    ]
  },
  ": a small current into the base allows a larger current to flow from collector to emitter."
];

