import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FamilyInterface, GenusInterface, ParentType } from 'src/family/family.interface';

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
        console.log(person);
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
      this.trees.map(({ id, gender }) => {
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
          arrayParent.push(parentId);
        }
        if (setParentWithGender.has(parentId)) {
          if (mather) {
            throw new HttpException(
              `У члена родословной не может быть две матери. Ошибка в id: ${person.id}`,
              HttpStatus.BAD_REQUEST,
            );
          }
          mather = true;
          arrayParent.push(parentId);
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
    this.trees.map(({ id, name, parents }) => {
      parents.map((parentId) => {
        if (cid === parentId) {
          list.push(name);
          this.displayProgenies(id, list);
        }
      });
    });
    let set = new Set();
    list.map((id) => set.add(id));
    for (let name of set) {
      result = result + name + '\n';
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
      this.trees.map(({ name, gender, parents }) => {
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
    this.trees.map(({ id, name, gender, parents }) => {
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

  displayIncestuousMarriage(): string | undefined {
    let level: number = 4; //уровень вложенности, по которому нужна проверка
    let result: GenusInterface;
    let names: string[] = [];
    for (let { id, name, parents } of this.trees) {
      if (parents.length !== 0) {
        // if (id === 1312) {
        let person: GenusInterface = { id, genus: parents, generation: [], level, incest: false }; //0 поколение
        for (let i = 0; i < this.countParents(parents); i++) {
          person.generation.push(0);
        }
        // console.log('1', name, person);
        person = this.parentsToGenus(person);
        result = person;
        // console.log('2', name, person);
        if (result.incest) {
          names.push(name);
        }
        // }
      }
    }
    return names.join('\n');
  }

  parentsToGenus(person: GenusInterface): GenusInterface {
    let checkedParent: number[] = [];
    let checkedGenus: number[] = [];
    let gen = person.generation[person.generation.length - 1] + 1; //Поколение, которое ищу
    let iPrevGen = person.generation.indexOf(gen - 1); //Индекс предыдущего поколения в genus
    // console.log('Индекс с которого начинается перебор в массиве person.genus', iPrevGen);
    for (let p = iPrevGen; p < person.genus.length; p++) {
      if (person.genus[p] > 0) {
        this.trees.map(({ id, parents }) => {
          if (person.genus[p] === id) {
            let countParents = this.countParents(parents);
            if (countParents !== 0) {
              for (let i = 0; i < countParents; i++) {
                checkedParent.push(parents[i]);
                checkedGenus.push(gen);
              }
            } else {
              checkedParent.push(-Math.floor(1 + Math.random() * (9999 + 1 - 1)));
              checkedGenus.push(gen);
            }
          }
        });
      }
    }
    checkedParent.map((cid) => {
      person.genus.push(cid);
    });
    checkedGenus.map((cid) => {
      person.generation.push(cid);
    });
    let chekSet: Set<number> = new Set();
    person.genus.map((id) => chekSet.add(id));
    if (chekSet.size !== person.genus.length) {
      person.incest = true;
    }
    if (!person.incest) {
      for (let i = gen; i < person.level; i++) {
        if (checkedParent.length !== 0) {
          this.parentsToGenus(person);
        }
      }
    }
    return person;
  }

  countParents(parents: ParentType): number {
    let result = 0;
    if (Array.isArray(parents)) {
      result = parents.length;
    }
    return result;
  }
}
