interface IconComponentPropType {
  height?: number
  width?: number
  fill?: string
}

const CrossIcon = ({width=20, height=19, fill='#7677F4'}:IconComponentPropType) => {
  return (
    <svg width={width} height={height} viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18 1.5L2 17.5M2 1.5L18 17.5" stroke="#333333" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill={fill}/>
</svg>
  )
}

export default CrossIcon