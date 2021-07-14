import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
} from 'typeorm';

export interface IWebUser {
	username: string;
	password: string;
	authorized: boolean;
	email: string;
	suspended: boolean;
	admin: boolean;
}

@Entity()
export class WebUser implements IWebUser {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	username: string;
	@Column()
	password: string;
	@Column()
	authorized: boolean;
	@Column({ unique: true })
	email: string;
	@Column()
	suspended: boolean;
	@Column()
	admin: boolean;

	@CreateDateColumn({ type: 'timestamptz' })
	createdAt: Date;
}
