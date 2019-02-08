/**
 * create by Lin_HR at 2019/1/15
 * 原生操作模块, 协议地址
 */

const N_Mark = {
    PTC_MAIN: {
        WINDOW:         001,
        FILE:           002,
        STATE:          003
    },

    WINDOW: {
        MIN:            101,
        MAX:            102,
        CLOSE:          103,
        REDU:           104,
        FLASH_FRAME:    105
    },

    FILE: {
        GET_HOST:       201
    },

    STATE: {
        LOGIN_ACCESS:   301
    }
}

module.exports = N_Mark;