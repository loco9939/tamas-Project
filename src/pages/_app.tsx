import { tw } from '@/utils/tailwindMerge';

type AppProps<T extends React.ElementType> = Component<T>;

export default function App({
  children,
  className,
  ...restProps
}: AppProps<'div'>) {
  return (
    <div
      className={tw('mt-16 font-line-seed-sans-kr', className)}
      {...restProps}
    >
      {children}
    </div>
  );
}
