'use server'

import xlsx from 'node-xlsx'

export const prepareExcel = async (
  data: {
    name: string
    data: (string | number)[][]
    options: object
  }[],
) => {
  const formattedData = data.map((d) => ({
    ...d,
    name: d.name.slice(0, 31),
  }))
  const buffer = xlsx.build(formattedData)

  const arrayBuffer = new ArrayBuffer(buffer.length)
  const view = new Uint8Array(arrayBuffer)
  for (let i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i]
  }
  return arrayBuffer
}
