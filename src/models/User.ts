import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
} from 'typeorm';

export interface IUser {
	username: string;
	password: string;
	authorized: boolean;
}

@Entity()
export class User implements IUser {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	username: string;
	@Column()
	password: string;
	@Column()
	authorized: boolean;

	@CreateDateColumn({ type: 'timestamptz' })
	createdAt: Date;
}
