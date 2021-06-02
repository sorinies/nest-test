import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("getAll", () => {
    it("테스트: 배열을 반환해야함.", () => {
      const result = service.getAll();
      expect(result).toBeInstanceOf(Array);
    })
  })
  describe("getOne", () => {
    it("테스트: movie를 반환해야함.", () => {
      service.create({
        title: "TEST MOVIE",
        genres: ["Test"],
        year: 2000,
      })
      const movie = service.getOne(1);
      expect(movie).toBeDefined();
      expect(movie.id).toEqual(1);
    })
    it("테스트: 404에러를 던져야함.", () => {
      try{
        service.getOne(999);
      }catch(err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toEqual("Movie with ID: 999 not found.");
      }
    })
  })
  describe("deleteOne", () => {
    it("테스트: movie를 지움", () => {
            service.create({
        title: "TEST MOVIE",
        genres: ["Test"],
        year: 2000,
      });
      const beforeDelete = service.getAll().length;
      service.deleteOne(1);
      const afterDelete = service.getAll().length;
      expect(afterDelete).toBeLessThan(beforeDelete);
    });
    it("테스트: 404에러를 던져야함.", () => {
      try {
        service.deleteOne(999);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toEqual("Movie with ID: 999 not found.");
      }
    });
  });
  describe("create", () => {
    it("테스트: movie를 만들어야 함.", () => {
      const beforeCreate = service.getAll().length;
      service.create({
        title: "TEST MOVIE",
        genres: ["Test"],
        year: 2000,
      });
      const afterCreate = service.getAll().length;
      console.log(beforeCreate, afterCreate);
      expect(afterCreate).toBeGreaterThan(beforeCreate);
    });
  });
  describe("update", () => {
    it("테스트: movie를 업데이트 함.", () => {
      service.create({
        title: "TEST MOVIE",
        genres: ["Test"],
        year: 2000,
      });
      service.update(1, {title: 'updated title'});
      const movie = service.getOne(1);
      expect(movie.title).toEqual('updated title');
    });
    it("테스트: NotFoundException을 던져야함.", () => {
      try {
        service.update(999, {});
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
