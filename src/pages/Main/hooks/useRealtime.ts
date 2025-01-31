import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface RealtimeInfo {
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

export interface RealtimeReqParams {
  stationId: string;
  routeIds: string[];
  predictDate: string;
}

type FetchRealtime = (params: RealtimeReqParams) => Promise<RealtimeInfo[]>;

const fetchRealtime: FetchRealtime = async ({
  stationId,
  routeIds,
  predictDate,
}) => {
  try {
    const url = `${
      import.meta.env.VITE_END_POINT
    }/realtime/${stationId}?predictDate=${predictDate}&${routeIds
      .map((id) => `routeIds=${id}`)
      .join('&')}`;

    const res = await fetch(url);

    return res.json() as unknown as RealtimeInfo[];
  } catch {
    throw new Error('Realtime fetch error');
  }
};

export const useRealtime = (params: RealtimeReqParams) => {
  const queryClient = useQueryClient();

  const query = useQuery<RealtimeInfo[]>({
    queryKey: ['realtime', params],
    queryFn: async () => fetchRealtime(params),
  });

  const mutation = useMutation({
    mutationFn: fetchRealtime,
    onSuccess: async () => {
      await queryClient.invalidateQueries(['realtime']);
    },
  });

  return { ...query, mutation };
};
