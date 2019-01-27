let Mark = {
    SEND: 901,
    RECV: 902,

    PTC_MAIN: {
        STATE:  001,
        AUTH:   002
    },

    STATE: {
        CONNECT_REQUEST:        101,
        CONNECT_ACCESS:         102
    },

    AUTH: {
        LOGIN_REQUEST:          201,
        LOGIN_RESPONSE_SUCC:    202,
        LOGIN_RESPONSE_FAIL:    203
    }
}

module.exports = Mark;