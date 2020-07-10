import { IsString, IsUUID } from "class-validator";
import { ApiParam, ApiProperty } from "@nestjs/swagger";

export class UserSignResponseDto {
    @IsString()
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlYTk2Yzg4YS0zNGMzLTRlMGUtYWM4Mi1jY2JkNDQ5ZGM0OGQiLCJ1c2VybmFtZSI6Im1pY2hlbHNwZWRyb3NvQGdtYWlsLmNvbSIsImlhdCI6MTU5NDI3Nzc5NywiZXhwIjoxNTk1NDg3Mzk3fQ.LecCXOzsoo8mqT0dkwkrjnvIiN6bJoTi5oaZENZf7SY' })
    accessToken: string;

    @IsUUID()
    @ApiProperty({ example: 'ea96c88a-34c3-4e0e-ac82-ccbd449dc48d' })
    userId: string;
}
