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
    instances: {
      id: string;
      name: string;
      status: string;
      uptime: number;
      history: number[];
      responseTime: string;
    }[];
  };
}
