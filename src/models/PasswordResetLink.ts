import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	PrimaryGeneratedColumn,
} from 'typeorm';

export interface IPasswordResetLink {
	email: string;
	link: string;
	expires: number;
}

@Entity()
export class PasswordResetLink implements IPasswordResetLink {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	email: string;
	@Index()
	@Column({ type: 'uuid' })
	link: string;
	@Column({ type: 'int8' })
	expires: number;

	@CreateDateColumn({ type: 'timestamptz' })
	createdAt: Date;
}
