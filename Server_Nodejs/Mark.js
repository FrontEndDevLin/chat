let Mark = {
    IO_EVENT: {
        LISTENING:              1000,
        CONNECTION:             1001,
        DATA:                   1002,
        CLOSE:                  1003,
        ERROR:                  1004
    },

    PTC_MAIN: {
        STATE:                  001,
        AUTH:                   002,
        INIT:                   003,
        CHAT:                   004
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
    },

    INIT: {
        GET_FRIENDSLIST:        301,
        RES_FRIENDSLIST:        302,
        GET_RECENTCONTACT:      303,
        RES_RECENTCONTACT:      304
    },

    CHAT: {
        SEND_MESSAGE:           401,
        RECV_MESSAGE:           402,
        GET_TARGET_AVATAR:      403,
        RES_TARGET_AVATAR:      405,
        READED_MSG:             406,
        MSG_HISTORY_REQUEST:    407,
        MSG_HISTORY_RESPONSE:   408
    }
}

module.exports = Mark;