let Mark = {
    SEND: 901,
    RECV: 902,

    PTC_MAIN: {
        STATE:  001
    },

    STATE: {
        CONN_CHECK_REQUEST:     101,
        CONN_CHECK_RESPONSE:    102,
        CONNECT_REQUEST:        103,
        CONNECT_ACCESS:         104
    }
}

module.exports = Mark;