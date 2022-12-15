import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AD, BusCard, Notification, SyncButton } from '@/components';
import { MainHeader } from './components';
import NotFound from '../404';

type Location = {
  hash: string;
  key: string;
  pathname: string;
  search: string;
  state: {
    bus: string[];
    stationName: string;
    userStation: string;
  };
};

export default function Main() {
  const navigate = useNavigate();
  const location: Location = useLocation();
  const queryClient = useQueryClient();

  const TEST_URL =
    'https://raw.githubusercontent.com/TAMAS-Inc/MockAPI/main/realtime/228000191.routeIds.228000176.228000182.json';
  const testData = {
    stationId: '228000191',
    predictDate: '2022-12-25T07:25',
    routeIds: [228000176, 228000182],
  };

  const fetcher = () => fetch(TEST_URL).then((res) => res.json());

  const { isLoading, isError, data } = useQuery<RealtimeInfo[]>(
    ['realtime', testData],
    () => fetcher()
  );

  const mutation = useMutation(() => fetcher(), {
    onSuccess: async () => {
      await queryClient.invalidateQueries(['realtime']);
    },
  });

  useEffect(() => {
    if (!location.state?.userStation) {
      // navigate('/landing/agreement');
    }
  }, [location.state, navigate]);

  if (isError) return <NotFound />;

  interface RealtimeInfo {
    /** 실시간 정보 존재 여부 */
    exist: boolean;
    /** 노선명 */
    routeName: string;
    /** 노선 ID */
    routeId: string;
    /** 현재 남은 좌석 수 */
    remainSeatCnt: number;
    /** 현재 남은 정거장 수 */
    remainStationCnt: number;
    /** 도착까지 남은 시간(분) */
    predictRemainTime: number;
    /** 예측한 도착 시 남을 좌석 */
    predictRemainSeatCnt: number;
  }

  const handleSyncButtonClick = () => {
    mutation.mutate();
  };

  return (
    <>
      <MainHeader>{location.state?.userStation ?? '춘시기넹'}</MainHeader>
      <Notification />
      {isLoading || mutation.isLoading ? (
        <span>Loading...</span>
      ) : (
        data?.map(
          ({
            exist,
            routeId,
            routeName,
            remainSeatCnt,
            remainStationCnt,
            predictRemainTime,
            predictRemainSeatCnt,
          }: RealtimeInfo) => (
            <BusCard
              key={routeId}
              onClick={(e) => {
                if ((e.target as HTMLElement).closest('svg'))
                  navigate(`analysis/${routeName}`);
                else navigate(`busRoute/${routeName}`);
              }}
            >
              <BusCard.RouteName>{routeName}</BusCard.RouteName>
              <BusCard.Info>
                <BusCard.Content>
                  {exist ? `${predictRemainTime}분 후 도착` : '정보 없음'}
                </BusCard.Content>
                {exist && (
                  <BusCard.Content>
                    {remainStationCnt}번째 전 (실시간 {remainSeatCnt}석, 예측
                    {predictRemainSeatCnt === -1
                      ? '정보 없음'
                      : ` 
                    ${predictRemainSeatCnt}석`}
                    )
                  </BusCard.Content>
                )}
              </BusCard.Info>
              <BusCard.InfoIcon />
            </BusCard>
          )
        )
      )}
      <SyncButton onClick={handleSyncButtonClick} />
      <AD />
    </>
  );
}
