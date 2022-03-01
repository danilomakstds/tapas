

const HOLIDAY_TYPE = {
    NATIONAL: "National holiday",
    COMMON_LOCAL: "Common local holiday",
    MUSLIM: "MUSLIM",
    WEEKEND: "Weekend",
    SEASON: "Season",
    OBSERVANCE: "Observance",
};

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const USERLEVEL = {
    ADMIN: '2',
    HR: '1',
    USER: '0'
}

const LEAVE_APPROVAL_STATUS = {
    PENDING: '0',
    APPROVED: '1',
    REJECTED: '2'
}

export default {
    HOLIDAY_TYPE: HOLIDAY_TYPE,
    WEEKDAYS: WEEKDAYS,
    USERLEVEL: USERLEVEL,
    LEAVE_APPROVAL_STATUS: LEAVE_APPROVAL_STATUS
}