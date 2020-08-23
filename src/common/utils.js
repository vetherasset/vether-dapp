import BigNumber from 'bignumber.js'

export const one = 1 * 10 ** 18;
export const oneBN = new BigNumber(1 * 10 ** 18)

export function getBN(BN){
    return (new BigNumber(BN)).toFixed()
}

export function getBig(BN){
    return new BigNumber(BN)
}

export function BN2Str(BN) {
    return (new BigNumber(BN)).toFixed()
}

export const totalSupply = (new BigNumber(1000000*10**18)).toFixed(0)

export function convertFromWei(number) {
    const num = new BigNumber(number)
    const final = num.div(10**18)
    return final.toString()
}

export function convertToWei(number) {
    const num = new BigNumber(number)
    const final = num.multipliedBy(10**18)
    return (final).toFixed(0)
}

export function convertToDate(date) {
    return new Date(1000 * date).toLocaleDateString("en-GB", { year: 'numeric', month: 'short', day: 'numeric' })
}

export function currency(amount, minFractionDigits = 0, maxFractionDigits = 2, currency = 'USD', locales = 'en-US') {
    let symbol
    let cryptocurrency = false
    let options = {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: minFractionDigits,
        maximumFractionDigits: maxFractionDigits
    }

    if (currency === 'ETH') {
        options = {
            style: 'decimal',
            minimumFractionDigits: minFractionDigits,
            maximumFractionDigits: maxFractionDigits
        }
        symbol = 'Ξ'
        cryptocurrency = true
    }

    if (currency === 'VETH') {
        options = {
            style: 'decimal',
            minimumFractionDigits: minFractionDigits,
            maximumFractionDigits: maxFractionDigits
        }
        symbol = 'VETH'
        cryptocurrency = true
    }

    const currencyValue = new Intl.NumberFormat(locales, options)

    return (cryptocurrency ? `${currencyValue.format(amount)} ${symbol}` : currencyValue.format(amount))
}

export function convertToTime(date) {
    return new Date(1000 * date).toLocaleTimeString("en-gb")
}

export function convertToMonth(date_) {
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const date = new Date(1000 * date_)
    return (date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear())
}

export function getSecondsToGo(date) {
    const time = (Date.now() / 1000).toFixed()
    return ((date - time))
}

export const formatAPY = (input) =>{
    let annual = ((input - (10000*365)/100))
    return `${annual}%`
}