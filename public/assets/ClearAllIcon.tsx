interface IconComponentPropType {
  height?: number
  width?: number
  fill?: string
}
const ClearAllIcon = ({ width = 20, height = 19, fill = '#7677F4' }: IconComponentPropType) => {
  return (
    <svg width={width} height={height} viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9.05952 0.187508C5.46402 0.187508 2.50902 2.93476 2.22102 6.43726H1.50027C1.38875 6.43721 1.27973 6.4703 1.18707 6.53234C1.0944 6.59438 1.02227 6.68256 0.979827 6.78569C0.937387 6.88881 0.926558 7.00223 0.948715 7.11152C0.970871 7.22081 1.02501 7.32105 1.10427 7.39951L2.36427 8.64901C2.46961 8.75343 2.61194 8.81202 2.76027 8.81202C2.9086 8.81202 3.05092 8.75343 3.15627 8.64901L4.41627 7.39951C4.49552 7.32105 4.54966 7.22081 4.57182 7.11152C4.59397 7.00223 4.58314 6.88881 4.5407 6.78569C4.49826 6.68256 4.42613 6.59438 4.33346 6.53234C4.2408 6.4703 4.13178 6.43721 4.02027 6.43726H3.35052C3.63552 3.56401 6.07902 1.31251 9.05952 1.31251C10.0422 1.31047 11.009 1.5606 11.8674 2.03897C12.7258 2.51734 13.4471 3.20796 13.9623 4.04476C14 4.10968 14.0503 4.16641 14.1103 4.21158C14.1702 4.25675 14.2386 4.28946 14.3115 4.30778C14.3843 4.32609 14.46 4.32965 14.5342 4.31823C14.6084 4.30682 14.6796 4.28066 14.7435 4.24131C14.8075 4.20195 14.8629 4.15019 14.9065 4.08908C14.9501 4.02798 14.9811 3.95875 14.9975 3.8855C15.014 3.81224 15.0156 3.73643 15.0023 3.66254C14.989 3.58865 14.961 3.51817 14.92 3.45526C14.3042 2.45497 13.4422 1.62932 12.4163 1.05722C11.3904 0.485114 10.2342 0.185672 9.05952 0.187508ZM15.631 6.35026C15.5257 6.24629 15.3837 6.18799 15.2358 6.18799C15.0878 6.18799 14.9458 6.24629 14.8405 6.35026L13.5753 7.59976C13.4958 7.67813 13.4414 7.77836 13.4191 7.88772C13.3968 7.99707 13.4075 8.11059 13.4499 8.21384C13.4922 8.31709 13.5644 8.4054 13.6571 8.46753C13.7498 8.52966 13.8589 8.56281 13.9705 8.56276H14.6448C14.3583 11.4353 11.9065 13.6875 8.91177 13.6875C7.92599 13.6903 6.95593 13.4405 6.09403 12.9621C5.23213 12.4837 4.50709 11.7926 3.98802 10.9545C3.94921 10.8916 3.8984 10.837 3.83848 10.7937C3.77856 10.7505 3.71071 10.7195 3.63881 10.7024C3.5669 10.6854 3.49234 10.6827 3.41939 10.6945C3.34644 10.7063 3.27653 10.7323 3.21364 10.7711C3.08663 10.8495 2.99596 10.9751 2.96157 11.1203C2.92719 11.2656 2.95189 11.4185 3.03027 11.5455C3.65017 12.5469 4.51614 13.3728 5.54569 13.9447C6.57523 14.5166 7.73406 14.8153 8.91177 14.8125C12.5178 14.8125 15.4855 12.0675 15.7743 8.56276H16.5003C16.6119 8.56281 16.721 8.52966 16.8137 8.46753C16.9064 8.4054 16.9785 8.31709 17.0209 8.21384C17.0633 8.11059 17.074 7.99707 17.0517 7.88772C17.0293 7.77836 16.975 7.67813 16.8955 7.59976L15.631 6.35026Z"
        fill={fill}
      />
    </svg>
  )
}

export default ClearAllIcon
