export interface StatsResponse {
  message: string;
  data: {
    overview: {
      uptime: number;
      serviceStatus: {
        active: number;
        all: number;
      };
      healthScore: number;
    };
  };
}
