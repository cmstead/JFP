function identity (value) {
    return value;
}

function inc (a) {
    return a + 1;
}

module.exports = {
    identity: identity,
    inc: inc
};