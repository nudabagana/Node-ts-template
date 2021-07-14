import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	PrimaryGeneratedColumn,
} from 'typeorm';

export interface IVerificationCode {
	email: string;
	code: number;
	expires: number;
}

@Entity()
export class VerificationCode implements IVerificationCode {
	@PrimaryGeneratedColumn()
	id: number;

	@Index()
	@Column()
	email: string;
	@Column({ type: 'integer' })
	code: number;
	@Column({ type: 'int8' })
	expires: number;

	@CreateDateColumn({ type: 'timestamptz' })
	createdAt: Date;
}
