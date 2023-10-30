import {Injectable} from '@angular/core';
import {Statement} from './statement';

@Injectable({
  providedIn: 'root',
})
export class StatementServiceService {
  statement: any;

  constructor() {
  }

  public getStatement() {
    return this.statement;
  }

  public setStatement(id: any) {
    this.statement = {
      id: id,
    };
  }

  public getStatementService(id) {
    const statements: Statement[] = this.getStatement();
    return statements.find(p => p.statementId === id);
  }
}
