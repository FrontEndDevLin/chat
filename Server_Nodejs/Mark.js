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
        LOGIN_RESPONSE_FAIL:    203,
        REGIST_REQUEST:         204,
        REGIST_RESPONSE_SUCC:   205,
        REGIST_RESPONSE_FAIL:   206
    }
}

module.exports = Mark;