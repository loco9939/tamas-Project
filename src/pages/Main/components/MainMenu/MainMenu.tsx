import { XMarkIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { tw } from '@/utils/tailwindMerge';
import { IconButton, List } from '@/components';
import { BaseModal } from '../../../../components/BaseModal/BaseModal';

type MainMenuProps<T extends React.ElementType> = {
  onDimBgClick: React.MouseEventHandler<HTMLDivElement>;
  onCloseButtonClick: React.MouseEventHandler<HTMLButtonElement>;
} & Component<T>;

export function MainMenu({
  children,
  className,
  onDimBgClick: handleDimBgClick,
  onCloseButtonClick: handleCloseButtonClick,
  ...restProps
}: MainMenuProps<'div'>) {
  const data = {
    공지사항: 'notice',
    문의하기: 'inquiry',
    이용약관: 'terms',
    '오픈소스 이용': 'opensource',
  };
  return (
    <BaseModal className={tw('', className)} {...restProps}>
      <BaseModal.Content className="right-0 h-full w-[300px] bg-White">
        <List>
          <IconButton
            onClick={handleCloseButtonClick}
            className="relative right-1 mt-[20px] h-14 w-full text-right"
          >
            <IconButton.Icon
              icon={XMarkIcon}
              className="absolute right-4 top-4 mr-3 h-6 w-6"
            />
          </IconButton>
          <List.Item className="h-25 mt-9 pl-4 pb-6">
            <List.Title className="text-left">
              <span>오늘도 산뜻한 출근길 되세요!</span>
            </List.Title>
          </List.Item>
          {Object.entries(data).map(([content, path]) => (
            <Link key={content} to={`/menu/${path}`}>
              <List.Item className="h-14 pl-4">
                <List.Title>{content}</List.Title>
              </List.Item>
            </Link>
          ))}
        </List>
      </BaseModal.Content>
      <BaseModal.DimBg onClick={handleDimBgClick} />
    </BaseModal>
  );
}
