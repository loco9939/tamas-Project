import { Link } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { BaseModal, BusCard } from '@/components';
import { currentComIdState, userState } from '@/state/atom';
import { tw } from '@/utils/tailwindMerge';

type DropdownModalProps<T extends React.ElementType> = {
  onDimBgClick: React.MouseEventHandler<HTMLDivElement>;
  handleCurrent?: React.Dispatch<React.SetStateAction<string>>;
} & Component<T>;

export function DropdownModal({
  children,
  className,
  onDimBgClick: handleDimBgClick,
  handleCurrent,
  ...restProps
}: DropdownModalProps<'div'>) {
  const user = useRecoilValue(userState);
  const [currentComId, setCurrentComId] = useRecoilState(currentComIdState);
  const handleBusCardClick = (id: Commute['comId']) => {
    setCurrentComId(id);
  };

  return (
    <BaseModal className={tw('', className)} {...restProps}>
      <BaseModal.Content className="bottom-0 h-[620px] w-full overflow-hidden rounded-lg bg-White">
        <div className="flex flex-row justify-between pt-8 pl-6 pr-8 pb-8">
          <div className="text-body1 font-bold">내 정류장 설정</div>
          <ul className="flex gap-2 text-body2">
            <li>
              <Link to="/commute">추가</Link>
            </li>
            <li>
              <Link to="/commute/edit">편집</Link>
            </li>
          </ul>
        </div>

        {user.commutes.map(({ comId, comName, station, routes }) => (
          <BusCard
            key={comId}
            id={comId}
            className="flex cursor-pointer flex-col items-start justify-center truncate"
            onClick={() => handleBusCardClick(comId)}
          >
            <BusCard.Info className="static left-0 flex translate-x-0 flex-row">
              <BusCard.Content className="mr-4 w-28 text-ellipsis text-body1 line-clamp-1">
                {comName}
              </BusCard.Content>
              <BusCard.StationName className="mb-0 flex items-center justify-center">
                {station.stationName}
              </BusCard.StationName>
            </BusCard.Info>
            <BusCard.Content className="text-Gray-400">
              {routes.flatMap(({ routeName }) => routeName).join(', ')}
            </BusCard.Content>
            {comId === currentComId && <BusCard.CheckIcon isChecked />}
          </BusCard>
        ))}
      </BaseModal.Content>
      <BaseModal.DimBg onClick={handleDimBgClick} />
    </BaseModal>
  );
}
