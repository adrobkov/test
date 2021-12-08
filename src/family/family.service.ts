import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {FamilyInterface, ParentType} from 'src/family/family.interface';

@Injectable()
export class FamilyService {

  private trees: Array<FamilyInterface> = [];

  createOne(newPerson: FamilyInterface, validation = false): FamilyInterface {
    const person = this.trees.find((p) => p.id === newPerson.id);
    if (person) {
      throw new HttpException(
        `Член родословной с таким id уже существует. Ошибка в id: ${newPerson.id}`,
        HttpStatus.CONFLICT,
      );
    }
    if (validation) {
      if (newPerson.parents.length > 0) {
        this.validateCountParent(newPerson);
        this.validateSelfParent(newPerson);
        this.validateParentOneGenderOrNotFound(newPerson);
      }
    }
    this.trees.push(newPerson);
    return newPerson;
  }

  getOne(id: number, validation = false): FamilyInterface {
    const person = this.trees.find((p) => p.id === id);
    if (!person) {
      throw new HttpException(`Член родословной с таким id не найден. Ошибка в id: ${id}`, HttpStatus.NOT_FOUND);
    }
    if (validation) {
      if (person.parents.length > 0) {
        this.validateCountParent(person);
        this.validateSelfParent(person);
        this.validateParentOneGenderOrNotFound(person);
      }
    }
    return person;
  }

  getAll(validation = false): Array<FamilyInterface> {
    if (validation) {
      this.trees.map((person) => {
        console.log(person)
        if (person.parents.length > 0) {
          this.validateCountParent(person);
          this.validateSelfParent(person);
          this.validateParentOneGenderOrNotFound(person);
        }
      });
    }
    return this.trees;
  }

  updateOne(id: number, body: FamilyInterface, validation = false): FamilyInterface {
    const person = this.trees.find((p) => p.id === id);
    if (!person) {
      throw new HttpException('Член родословной с таким id не найден', HttpStatus.NOT_FOUND);
    }
    if (validation) {
      if (body.parents.length > 0) {
        this.validateCountParent(body);
        this.validateSelfParent(body);
        this.validateParentOneGenderOrNotFound(body);
      }
    }

    const idx = this.trees.findIndex((p) => p.id === id);
    this.trees[idx] = body;
    return body;
  }

  deleteOne(id: number): FamilyInterface {
    const idx = this.trees.findIndex((p) => p.id === id);
    if (idx < 0) {
      throw new HttpException('Член родословной с таким id не найден', HttpStatus.NOT_FOUND);
    }
    const person = this.trees.find((p) => p.id === id);
    this.trees.splice(idx, 1);
    return <FamilyInterface>person;
  }

  validateCountParent(person: FamilyInterface): void {
    if (person.parents.length > 2) {
      throw new HttpException(
        `У члена родословной не может быть более двух родителей. Ошибка в id: ${person.id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  validateSelfParent(person: FamilyInterface): void {
    person.parents.map((pid) => {
      if (pid === person.id) {
        throw new HttpException(
          `Член родословной не может являться родителем сам себе. Ошибка в id: ${person.id}`,
          HttpStatus.BAD_REQUEST,
        );
      }
    });
  }

  validateParentOneGenderOrNotFound(person: FamilyInterface): void {
    if (this.trees.length > 1) {
      let setParentWithGender = new Set();
      this.trees.map(({id, gender}) => {
        setParentWithGender.add(gender === 'MALE' ? -id : id);
      });
      let arrayParent: Array<number | any> = [];
      let father = false;
      let mather = false;
      person.parents.map((parentId) => {
        if (setParentWithGender.has(-parentId)) {
          if (father) {
            throw new HttpException(
              `У члена родословной не может быть два отца. Ошибка в id: ${person.id}`,
              HttpStatus.BAD_REQUEST,
            );
          }
          father = true;
        }
        if (setParentWithGender.has(parentId)) {
          if (mather) {
            throw new HttpException(
              `У члена родословной не может быть две матери. Ошибка в id: ${person.id}`,
              HttpStatus.BAD_REQUEST,
            );
          }
          mather = true;
        }
      });
      if (arrayParent.length !== person.parents.length) {
        throw new HttpException(
          `Идентификатор родителя не существует. Ошибка в id: ${person.id}`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  displayProgenies(cid: number, list: string[] = []): string | undefined {
    let result: string = '';
    const person = this.trees.find((p) => p.id === cid);
    if (!person) {
      throw new HttpException('Член родословной с таким id не найден', HttpStatus.NOT_FOUND);
    }
    this.trees.map(({id, name, parents}) => {
      parents.map((parentId) => {
        if (cid === parentId) {
          list.push(name);
          this.displayProgenies(id, list);
        }
      });
    });
    let set = new Set;
    list.map(id => set.add(id));
    for (let name of set) {
      result = result + name + '\n'
    }
    return result;
  }

  displayBrothersAndSisters(cid: number): string | undefined {
    let list: string[] = [];
    const person = this.trees.find((p) => p.id === cid);
    if (!person) {
      throw new HttpException('Член родословной с таким id не найден', HttpStatus.NOT_FOUND);
    }
    if (person.parents.length === 0) {
      return;
    }
    if (person.parents.length === 1) {
      this.trees.map(({name, gender, parents}) => {
        parents.map((parentId) => {
          if (parentId === person.parents[0]) {
            let type = gender === 'FEMALE' ? 'сводная' : 'сводный';
            list.push(`${name} (${type})`);
          }
        });
      });
      return;
    }
    let type = '';
    this.trees.map(({id, name, gender, parents}) => {
      if (id !== cid) {
        let p1 = parents.find((pid) => pid === person.parents[0]);
        let p2 = parents.find((pid) => pid === person.parents[1]);
        if (!p1 && !p2) {
          return;
        }
        if (!!p1 || !!p2) {
          type = gender === 'FEMALE' ? ' (сводная)' : ' (сводный)';
        }
        if (!!p1 && !!p2) {
          type = gender === 'FEMALE' ? ' (родная)' : ' (родной)';
        }
        list.push(name + type);
      }
    });
    return list.join('\n');
  }

  displayIncestuous(): string | undefined {
    let listArray: string[] = [];
    for (let {name, parents} of this.trees) {
      let parents1 = this.parentsById(parents[0]);
      let parents2 = this.parentsById(parents[1]);
      //Родные и сводные братья и сестры
      if (this.compare(parents1, parents2)) {
        listArray.push(name);
      }
      //Родители
      if (this.compare(parents, parents2)) {
        listArray.push(name);
      }
      if (this.compare(parents1, parents)) {
        listArray.push(name);
      }
      //Родители родителей
      if (this.countParents(parents1) === 2) {
        if (this.compare(parents, this.parentsById(parents1[0]))) {
          listArray.push(name);
        }
        if (this.compare(parents, this.parentsById(parents1[1]))) {
          listArray.push(name);
        }
        if (this.compare(parents1, this.parentsById(parents1[0]))) {
          listArray.push(name);
        }
        if (this.compare(parents1, this.parentsById(parents1[1]))) {
          listArray.push(name);
        }
      }
      if (this.countParents(parents1) === 1) {
        if (this.compare(parents, this.parentsById(parents1[0]))) {
          listArray.push(name);
        }
        if (this.compare(parents1, this.parentsById(parents1[0]))) {
          listArray.push(name);
        }
      }
      if (this.countParents(parents2) === 2) {
        if (this.compare(parents, this.parentsById(parents2[0]))) {
          listArray.push(name);
        }
        if (this.compare(parents, this.parentsById(parents2[1]))) {
          listArray.push(name);
        }
        if (this.compare(parents2, this.parentsById(parents2[0]))) {
          listArray.push(name);
        }
        if (this.compare(parents2, this.parentsById(parents2[1]))) {
          listArray.push(name);
        }
      }
      if (this.countParents(parents2) === 1) {
        if (this.compare(parents, this.parentsById(parents2[0]))) {
          listArray.push(name);
        }
        if (this.compare(parents2, this.parentsById(parents2[0]))) {
          listArray.push(name);
        }
      }
    }
    let result = '';
    let set = new Set;
    listArray.map(id => set.add(id));
    for (let name of set) {
      result = result + name + '\n'
    }
    return result;
  }

  parentsById(pid: number): ParentType {
    let result: ParentType
    this.trees.map(({id, parents}) => {
      if (id === pid) {
        result = parents.sort();
      }
    });
    return result;
  }

  countParents(parents: ParentType): number{
    let result = 0;
    if (Array.isArray(parents)) {
      result = parents.length;
    }
    return result;
  }

  compare(parents1: ParentType, parents2: ParentType): boolean {
    if (!Array.isArray(parents1) || !Array.isArray(parents2)) {
      return false;
    }
    if (parents1.length === 2 && parents2.length === 2) {
      if (this.compare2Arrays([parents1[0], parents1[1]], [parents2[0], parents2[1]])) {
        return true;
      }
      if (this.compareArrayAndNumber([parents1[0], parents1[1]], parents2[0])) {
        return true;
      }
      if (this.compareArrayAndNumber([parents1[0], parents1[1]], parents2[1])) {
        return true;
      }
      if (this.compareArrayAndNumber([parents2[0], parents2[1]], parents1[0])) {
        return true;
      }
      if (this.compareArrayAndNumber([parents2[0], parents2[1]], parents1[1])) {
        return true;
      }
    } else if (parents1.length === 1 && parents2.length === 2) {
      if (this.compareArrayAndNumber([parents2[0], parents2[1]], parents1[0])) {
        return true;
      }
    } else if (parents1.length === 2 && parents2.length === 1) {
      if (this.compareArrayAndNumber([parents1[0], parents1[1]], parents2[0])) {
        return true;
      }
    } else if (parents1.length === 1 && parents2.length === 1) {
      if (parents1[0] === parents2[0]) {
        return true;
      }
    }
    return false;
  }

  compare2Arrays(arr1: [number, number], arr2: [number, number]): boolean {
    return arr1.length == arr2.length && arr1.every((v, i) => v === arr2[i]);
  }

  compareArrayAndNumber(arr: [number, number], num: number): boolean {
    return arr.some((v) => v === num);
  }
}
