module.exports = (request, reply) => {
    const payload = request.payload;
    ProductModel.create(payload);
    return reply.api({
        test: request.i18n.__('Client IP {{clientIp}}', {
            clientIp: request.clientIp
        })
    }).code(1000);
}