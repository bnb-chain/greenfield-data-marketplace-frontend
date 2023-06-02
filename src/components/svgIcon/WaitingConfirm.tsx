import { Icon, IconProps } from '@totejs/icons';

const WaitingConfirm = (props: IconProps) => {
  return (
    <Icon
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M73.3334 40.0001C73.3334 58.4096 58.4096 73.3334 40.0001 73.3334C21.5906 73.3334 6.66675 58.4096 6.66675 40.0001C6.66675 21.5906 21.5906 6.66675 40.0001 6.66675C58.4096 6.66675 73.3334 21.5906 73.3334 40.0001Z"
        fill="#F1B720"
      />
      <circle cx="23.6733" cy="40" r="4.89796" fill="white" />
      <circle cx="40" cy="40" r="4.89796" fill="white" />
      <circle cx="56.3264" cy="40" r="4.89796" fill="white" />
    </Icon>
  );
};

export default WaitingConfirm;
