

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

const LEAVE_TYPES = {
    VACATION: '2',
    SICK: '1',
    EMERGENCY: '3',
    MATERNITY: '4',
    BIRTHDAY: '5'
}

export default {
    HOLIDAY_TYPE: HOLIDAY_TYPE,
    WEEKDAYS: WEEKDAYS,
    USERLEVEL: USERLEVEL,
    LEAVE_APPROVAL_STATUS: LEAVE_APPROVAL_STATUS,
    LEAVE_TYPES: LEAVE_TYPES
}