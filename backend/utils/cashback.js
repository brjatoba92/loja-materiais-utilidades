const calcularPontosCashback = (valorCompra) => {
    return Math.floor(valorCompra / 50); // 1 ponto por R$ 50
};

/**
 * Converte pontos para valor em reais
*/
const pontosParaReal = (pontos) => {
    return pontos * 1;
};

/**
 * Calcula o desconto máximo que pode ser aplicado
*/

const calcularDescontoMaximo = (pontosDisponiveis, valorCompra) => {
    const descontoMaximo = pontosParaReal(pontosDisponiveis);
    return Math.min(descontoMaximo, valorCompra);
}
module.exports = {
    calcularPontosCashback,
    pontosParaReal,
    calcularDescontoMaximo
};