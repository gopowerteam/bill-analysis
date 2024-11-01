interface CurrentOptions {
  thousands: boolean // 是否显示千分位
  prefix: boolean // 是否显示货币符号¥
  inputUnit?: CurrencyUnit // 输入缩放比例 2:分 0:元 默认为分
  outputUnit?: CurrencyUnit | 'auto' // 输出缩放比例 0：元 4:万 auto:自动(大于一万按万为单位)
  precision: number // 小数点后输出精度
  suffix?: string | boolean // 后缀单位 (outputScale为auto时自动添加后缀,可以设置为false关闭后缀显示)
  zeroString?: string // 当值为0时，是否使用字符串代替
  nanString?: string // 当值为NaN时，是否使用字符串代替
}

export type CurrencyUnit = '万' | '千' | '元' | '分'
export const CurrentUnitMaps: Map<CurrencyUnit, number> = new Map([
  ['分', 10 ** 0],
  ['元', 10 ** 2],
  ['千', 10 ** 5],
  ['万', 10 ** 6],
])
/**
 * 默认格式化配置
 */
const defaultConfig: Partial<CurrentOptions> = {
  thousands: true,
  prefix: false,
  inputUnit: '分',
  outputUnit: '元',
  precision: 2,
}

/**
 * 货币显示处理
 * @param value
 * @param config
 * @returns
 */
export function useCurrency(value: number, options?: Partial<CurrentOptions>) {
  const outputAutoSuffix = options?.outputUnit === 'auto'
  options = {
    ...defaultConfig,
    ...(options || {}),
    ...outputAutoSuffix
      ? {
          outputUnit: '元',
        }
      : {},
  }

  if (options.outputUnit === '千') {
    const scale1 = CurrentUnitMaps.get(options!.inputUnit!)! / CurrentUnitMaps.get(options!.outputUnit! as CurrencyUnit)!
    const value1 = parseFloat((value * scale1).toFixed(10))
    console.log(value, scale1, value1)
  }

  // 金额缩放处理
  const scale = CurrentUnitMaps.get(options!.inputUnit!)! / CurrentUnitMaps.get(options!.outputUnit! as CurrencyUnit)!
  value = parseFloat((value * scale).toFixed(10))

  const autoFormatValue = (value: number) => {
    if (value > 10000 && outputAutoSuffix) {
      return value / 10000
    }
    else {
      return value
    }
  }

  const autoFormatSuffix = (value: number) => {
    if (options.suffix === false) {
      return ''
    }

    if (typeof options.suffix === 'string') {
      return options.suffix
    }

    if (value > 10000 && outputAutoSuffix) {
      return '万'
    }
    else {
      return options.outputUnit
    }
  }

  if (options?.zeroString !== undefined && value === 0) {
    return options?.zeroString
  }

  if (options?.nanString !== undefined && isNaN(value)) {
    return options?.nanString
  }

  // 返回格式化金额
  return autoFormatValue(value).toLocaleString('zh-CN', {
    useGrouping: options.thousands,
    minimumFractionDigits: options.precision,
    maximumFractionDigits: options.precision,
    ...(options.prefix
      ? {
          currency: 'CNY',
          style: 'currency',
        }
      : {}),
  }) + autoFormatSuffix(value)
}
