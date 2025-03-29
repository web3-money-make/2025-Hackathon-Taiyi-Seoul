import { ApiProperty } from '@nestjs/swagger';

export class HistoryRequestDto {
  @ApiProperty({ description: '페이지 번호', required: false })
  page?: number = 1;
  @ApiProperty({ description: '페이지 당 항목 수', required: false })
  limit?: number = 10;
  @ApiProperty({ description: '프로토콜 ID', required: false })
  protocolId?: number;
  @ApiProperty({ description: '체인 ID', required: false })
  chainId?: number;
}
