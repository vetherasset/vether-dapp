import BigNumber from 'bignumber.js'

export const one = 1 * 10 ** 18;
export const oneBN = new BigNumber(1 * 10 ** 18)

export function getBN(BN){
    return (new BigNumber(BN)).toFixed()
}

export function getBig(BN){
    return new BigNumber(BN)
}

export function BN2Str(BN) { return (new BigNumber(BN)).toFixed() }

export const totalSupply = (new BigNumber(1000000*10**18)).toFixed(0)

export function convertFromWei(number) {
    var num = new BigNumber(number)
    var final = num.div(10**18)
    return final.toString()
}

export function convertToWei(number) {
    var num = new BigNumber(number)
    var final = num.multipliedBy(10**18)
    return (final).toFixed(0)
}

export function convertToDate(date) {
    return new Date(1000 * date).toLocaleDateString("en-GB", { year: 'numeric', month: 'short', day: 'numeric' })
}

export function prettify(amount) {
    const number = ((+amount).toFixed(2)).toString()
    var parts = number.replace(/\.?0+$/, '').split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

export function convertToTime(date) {
    return new Date(1000 * date).toLocaleTimeString("en-gb")
}

export function convertToMonth(date_) {
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const date = new Date(1000 * date_)
    let formatted_date = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear()
    return formatted_date
}

export function getSecondsToGo(date) {
    const time = (Date.now() / 1000).toFixed()
    const seconds = (date - time)
    return seconds
}