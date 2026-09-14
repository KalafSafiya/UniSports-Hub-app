module.exports = ({ date, start_time, end_time }) => {
    if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
    const parsed = new Date(date + 'T00:00:00Z');
    if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) return false;
    const time = /^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/;
    if (!time.test(start_time) || !time.test(end_time)) return false;
    return start_time.padEnd(8, ':00') < end_time.padEnd(8, ':00');
};
