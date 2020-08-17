import numeral from 'numeral'

export default (number) => {
  if (!number) return numeral.zeroFormat('N/A')

  return numeral(number).format('0,0[.]0')
}
