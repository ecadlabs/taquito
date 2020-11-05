export const parameter = {"prim":"or","args":[{"prim":"or","args":[{"prim":"or","args":[{"prim":"pair","args":[{"prim":"address"},{"prim":"nat"}],"annots":["%approve"]},{"prim":"pair","args":[{"prim":"pair","args":[{"prim":"address"},{"prim":"address"}]},{"prim":"contract","args":[{"prim":"nat"}]}],"annots":["%getAllowance"]}]},{"prim":"or","args":[{"prim":"pair","args":[{"prim":"address"},{"prim":"contract","args":[{"prim":"nat"}]}],"annots":["%getBalance"]},{"prim":"pair","args":[{"prim":"unit"},{"prim":"contract","args":[{"prim":"nat"}]}],"annots":["%getTotalSupply"]}]}]},{"prim":"or","args":[{"prim":"nat","annots":["%mint"]},{"prim":"pair","args":[{"prim":"pair","args":[{"prim":"address"},{"prim":"address"}]},{"prim":"nat"}],"annots":["%transfer"]}]}]}

export const getTotalSupply = {"prim":"pair","args":[{"prim":"unit"},{"prim":"contract","args":[{"prim":"nat"}]}]};

export const getBalance = {"prim":"pair","args":[{"prim":"address"},{"prim":"contract","args":[{"prim":"nat"}]}]};

export const getAllowance = {"prim":"pair","args":[{"prim":"pair","args":[{"prim":"address"},{"prim":"address"}]},{"prim":"contract","args":[{"prim":"nat"}]}]};