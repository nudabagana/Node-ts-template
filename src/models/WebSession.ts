import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
} from 'typeorm';

export interface IWebSession {
	token: string;
	userId: number;
	expires: number;
}

@Entity()
export class WebSession implements IWebSession {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	token: string;
	@Column()
	userId: number;
	@Column({ type: 'int8' })
	expires: number;

	@CreateDateColumn({ type: 'timestamptz' })
	createdAt: Date;
}
