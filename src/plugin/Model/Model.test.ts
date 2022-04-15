import Subject from '../Subject/Subject';
import IModel from './IModel';
import Model from './Model';

let model: IModel;

beforeEach(() => {
  model = new Model(new Subject(), {
    min: 0,
    max: 4,
    step: 2,
  });
});

describe('Model', () => {
  describe('options', () => {
    it('variant 1', () => {
      expect(model.options).toStrictEqual({
        min: 0,
        max: 4,
        step: 2,
        from: 0,
        to: 4,
        isDouble: false,
        hasTip: false,
        hasScale: false,
        isVertical: false,
      });
    });

    it('variant 2', () => {
      model = new Model(new Subject(), {
        min: 0,
        max: 1,
        step: 2,
      });

      expect(model.options).toStrictEqual({
        min: 0,
        max: 1,
        step: 1,
        from: 0,
        to: 1,
        isDouble: false,
        hasTip: false,
        hasScale: false,
        isVertical: false,
      });
    });

    it('variant 3', () => {
      model = new Model(new Subject(), {
        min: 1,
        max: 0,
        step: 2,
        from: 1,
        to: -1,
        isDouble: true,
        hasTip: true,
        hasScale: true,
        isVertical: true,
      });

      expect(model.options).toStrictEqual({
        min: -0.0001,
        max: 0,
        step: 0.0001,
        from: -0.0001,
        to: 0,
        isDouble: true,
        hasTip: true,
        hasScale: true,
        isVertical: true,
      });
    });

    it('variant 4', () => {
      model = new Model(new Subject(), {
        min: 1,
        max: 0,
        step: 2,
        from: 2,
      });

      expect(model.options).toStrictEqual({
        min: -0.0001,
        max: 0,
        step: 0.0001,
        from: 0,
        to: 0,
        isDouble: false,
        hasTip: false,
        hasScale: false,
        isVertical: false,
      });
    });

    it('variant 5', () => {
      // @ts-ignore
      expect(() => new Model(new Subject())).toThrow("Options object with 'min', 'max' and 'step' properties is required");
    });

    it('variant 6', () => {
      expect(() => new Model(new Subject(), {
        min: 0,
        max: 1,

        // @ts-ignore
        step: '',
      })).toThrow("'step' is not a finite number");
    });

    it('variant 7', () => {
      expect(() => new Model(new Subject(), {
        min: 0,
        max: 1,

        // @ts-ignore
        isDouble: '',
      })).toThrow("'isDouble' is not a 'boolean' type");
    });
  });

  describe('scale', () => {
    it('variant 1', () => {
      expect(model.scale).toStrictEqual([
        {
          position: 0,
          value: 0,
        },

        {
          position: 50,
          value: 2,
        },

        {
          position: 100,
          value: 4,
        },
      ]);
    });

    it('variant 2', () => {
      model = new Model(new Subject(), {
        min: 0,
        max: 10000,
        step: 1,
      });

      expect(model.scale.length).toBe(1001);
    });
  });

  it('activeTicks', () => {
    expect(model.activeTicks).toStrictEqual({
      from: {
        index: 0,
        tick: {
          position: 0,
          value: 0,
        },
      },

      to: {
        index: 2,
        tick: {
          position: 100,
          value: 4,
        },
      },
    });
  });

  it('initialize', () => {
    model.initialize();
  });

  describe('setMin', () => {
    it('min >= max', () => {
      model.setMin(5);

      expect(model.options.min).toBe(2);
      expect(model.scale).toStrictEqual([
        {
          position: 0,
          value: 2,
        },

        {
          position: 100,
          value: 4,
        },
      ]);

      expect(model.activeTicks).toStrictEqual({
        from: {
          index: 0,
          tick: {
            position: 0,
            value: 2,
          },
        },

        to: {
          index: 1,
          tick: {
            position: 100,
            value: 4,
          },
        },
      });
    });

    it('step > range', () => {
      model.setMin(3);

      expect(model.options.min).toBe(3);
      expect(model.options.step).toBe(1);
      expect(model.scale).toStrictEqual([
        {
          position: 0,
          value: 3,
        },

        {
          position: 100,
          value: 4,
        },
      ]);

      expect(model.activeTicks).toStrictEqual({
        from: {
          index: 0,
          tick: {
            position: 0,
            value: 3,
          },
        },

        to: {
          index: 1,
          tick: {
            position: 100,
            value: 4,
          },
        },
      });
    });

    it('else', () => {
      model.setMin(1);

      expect(model.options.min).toBe(1);
      expect(model.scale).toStrictEqual([
        {
          position: 0,
          value: 1,
        },

        {
          position: 66.6667,
          value: 3,
        },

        {
          position: 100,
          value: 4,
        },
      ]);

      expect(model.activeTicks).toStrictEqual({
        from: {
          index: 0,
          tick: {
            position: 0,
            value: 1,
          },
        },

        to: {
          index: 2,
          tick: {
            position: 100,
            value: 4,
          },
        },
      });
    });
  });

  describe('setMax', () => {
    it('max <= min', () => {
      model.setMax(-1);

      expect(model.options.max).toBe(2);
      expect(model.scale).toStrictEqual([
        {
          position: 0,
          value: 0,
        },

        {
          position: 100,
          value: 2,
        },
      ]);

      expect(model.activeTicks).toStrictEqual({
        from: {
          index: 0,
          tick: {
            position: 0,
            value: 0,
          },
        },

        to: {
          index: 1,
          tick: {
            position: 100,
            value: 2,
          },
        },
      });
    });

    it('step > range', () => {
      model.setMax(1);

      expect(model.options.max).toBe(1);
      expect(model.options.step).toBe(1);
      expect(model.scale).toStrictEqual([
        {
          position: 0,
          value: 0,
        },

        {
          position: 100,
          value: 1,
        },
      ]);

      expect(model.activeTicks).toStrictEqual({
        from: {
          index: 0,
          tick: {
            position: 0,
            value: 0,
          },
        },

        to: {
          index: 1,
          tick: {
            position: 100,
            value: 1,
          },
        },
      });
    });

    it('else', () => {
      model.setMax(3);

      expect(model.options.max).toBe(3);
      expect(model.scale).toStrictEqual([
        {
          position: 0,
          value: 0,
        },

        {
          position: 66.6667,
          value: 2,
        },

        {
          position: 100,
          value: 3,
        },
      ]);

      expect(model.activeTicks).toStrictEqual({
        from: {
          index: 0,
          tick: {
            position: 0,
            value: 0,
          },
        },

        to: {
          index: 2,
          tick: {
            position: 100,
            value: 3,
          },
        },
      });
    });
  });

  describe('setStep', () => {
    it('step <= 0', () => {
      model.setStep(-1);

      expect(model.options.step).toBe(2);
    });

    it('step > range', () => {
      model.setStep(5);

      expect(model.options.step).toBe(4);
      expect(model.scale).toStrictEqual([
        {
          position: 0,
          value: 0,
        },

        {
          position: 100,
          value: 4,
        },
      ]);

      expect(model.activeTicks).toStrictEqual({
        from: {
          index: 0,
          tick: {
            position: 0,
            value: 0,
          },
        },

        to: {
          index: 1,
          tick: {
            position: 100,
            value: 4,
          },
        },
      });
    });

    it('else', () => {
      model.setMax(0.0003);
      model.setStep(-0.00001);

      expect(model.options.step).toBe(0.0001);
      expect(model.scale).toStrictEqual([
        {
          position: 0,
          value: 0,
        },

        {
          position: 33.3333,
          value: 0.0001,
        },

        {
          position: 66.6666,
          value: 0.0002,
        },

        {
          position: 100,
          value: 0.0003,
        },
      ]);

      expect(model.activeTicks).toStrictEqual({
        from: {
          index: 0,
          tick: {
            position: 0,
            value: 0,
          },
        },

        to: {
          index: 3,
          tick: {
            position: 100,
            value: 0.0003,
          },
        },
      });
    });
  });

  describe('setFrom', () => {
    describe('position', () => {
      it('from <= first', () => {
        model.setFrom(-1, 'position');

        expect(model.options.from).toBe(0);
        expect(model.activeTicks.from).toStrictEqual({
          index: 0,
          tick: {
            position: 0,
            value: 0,
          },
        });
      });

      it('from >= interval / 2', () => {
        model.setFrom(25, 'position');

        expect(model.options.from).toBe(2);
        expect(model.activeTicks.from).toStrictEqual({
          index: 1,
          tick: {
            position: 50,
            value: 2,
          },
        });
      });

      describe('from >= last', () => {
        it('isDouble === false', () => {
          model.setFrom(101, 'position');

          expect(model.options.from).toBe(4);
          expect(model.activeTicks.from).toStrictEqual({
            index: 2,
            tick: {
              position: 100,
              value: 4,
            },
          });
        });

        it('isDouble === true', () => {
          model.setIsDouble(true);
          model.setFrom(101, 'position');

          expect(model.options.from).toBe(2);
          expect(model.activeTicks.from).toStrictEqual({
            index: 1,
            tick: {
              position: 50,
              value: 2,
            },
          });
        });
      });
    });

    describe('value', () => {
      it('from <= first', () => {
        model.setFrom(-1, 'value');

        expect(model.options.from).toBe(0);
        expect(model.activeTicks.from).toStrictEqual({
          index: 0,
          tick: {
            position: 0,
            value: 0,
          },
        });
      });

      it('from >= interval / 2', () => {
        model.setFrom(1, 'value');

        expect(model.options.from).toBe(2);
        expect(model.activeTicks.from).toStrictEqual({
          index: 1,
          tick: {
            position: 50,
            value: 2,
          },
        });
      });

      it('from >= last', () => {
        model.setFrom(5, 'value');

        expect(model.options.from).toBe(4);
        expect(model.activeTicks.from).toStrictEqual({
          index: 2,
          tick: {
            position: 100,
            value: 4,
          },
        });
      });
    });
  });

  describe('setTo', () => {
    describe('position', () => {
      it('to <= first', () => {
        model.setTo(-1, 'position');

        expect(model.options.to).toBe(2);
        expect(model.activeTicks.to).toStrictEqual({
          index: 1,
          tick: {
            position: 50,
            value: 2,
          },
        });
      });

      it('to >= interval / 2', () => {
        model.setTo(75, 'position');

        expect(model.options.to).toBe(4);
        expect(model.activeTicks.to).toStrictEqual({
          index: 2,
          tick: {
            position: 100,
            value: 4,
          },
        });
      });

      it('to >= last', () => {
        model.setTo(101, 'position');

        expect(model.options.to).toBe(4);
        expect(model.activeTicks.to).toStrictEqual({
          index: 2,
          tick: {
            position: 100,
            value: 4,
          },
        });
      });
    });

    describe('value', () => {
      it('to <= first', () => {
        model.setTo(-1, 'value');

        expect(model.options.to).toBe(2);
        expect(model.activeTicks.to).toStrictEqual({
          index: 1,
          tick: {
            position: 50,
            value: 2,
          },
        });
      });

      it('to >= interval / 2', () => {
        model.setTo(3, 'value');

        expect(model.options.to).toBe(4);
        expect(model.activeTicks.to).toStrictEqual({
          index: 2,
          tick: {
            position: 100,
            value: 4,
          },
        });
      });

      it('to >= last', () => {
        model.setTo(5, 'value');

        expect(model.options.to).toBe(4);
        expect(model.activeTicks.to).toStrictEqual({
          index: 2,
          tick: {
            position: 100,
            value: 4,
          },
        });
      });
    });
  });

  it('setIsDouble', () => {
    model.setFrom(4, 'value');
    model.setTo(2.1, 'value');

    model.setIsDouble(true);

    expect(model.options.from).toBe(0);
    expect(model.activeTicks.from).toStrictEqual({
      index: 0,
      tick: {
        position: 0,
        value: 0,
      },
    });
  });

  it('setHasTip', () => {
    model.setHasTip(true);

    expect(model.options.hasTip).toBe(true);
  });

  it('setHasScale', () => {
    model.setHasScale(true);

    expect(model.options.hasScale).toBe(true);
  });

  it('setIsVertical', () => {
    model.setIsVertical(true);

    expect(model.options.isVertical).toBe(true);
  });

  describe('setActiveTick', () => {
    it('position <= 0', () => {
      model.setActiveTick(-1);

      expect(model.options.from).toBe(0);
      expect(model.activeTicks.from).toStrictEqual({
        index: 0,
        tick: {
          position: 0,
          value: 0,
        },
      });
    });

    describe('position >= 100', () => {
      it('isDouble === false', () => {
        model.setActiveTick(101);

        expect(model.options.from).toBe(4);
        expect(model.activeTicks.from).toStrictEqual({
          index: 2,
          tick: {
            position: 100,
            value: 4,
          },
        });
      });

      it('isDouble === true', () => {
        model.setIsDouble(true);
        model.setTo(50, 'position');
        model.setActiveTick(101);

        expect(model.options.to).toBe(4);
        expect(model.activeTicks.to).toStrictEqual({
          index: 2,
          tick: {
            position: 100,
            value: 4,
          },
        });
      });
    });

    describe('else', () => {
      it('isDouble === false', () => {
        model.setActiveTick(50);

        expect(model.options.from).toBe(2);
        expect(model.activeTicks.from).toStrictEqual({
          index: 1,
          tick: {
            position: 50,
            value: 2,
          },
        });
      });

      it('isDouble === true', () => {
        model.setIsDouble(true);
        model.setActiveTick(50);

        expect(model.options.to).toBe(2);
        expect(model.activeTicks.to).toStrictEqual({
          index: 1,
          tick: {
            position: 50,
            value: 2,
          },
        });
      });
    });
  });

  describe('setActiveTickFromExactPosition', () => {
    it('isDouble === false', () => {
      model.setActiveTickFromExactPosition(50);

      expect(model.options.from).toBe(2);
      expect(model.activeTicks.from).toStrictEqual({
        index: 1,
        tick: {
          position: 50,
          value: 2,
        },
      });
    });

    describe('isDouble === true', () => {
      it('isExactBetween === false', () => {
        model.setIsDouble(true);
        model.setMax(6);
        model.setTo(100, 'position');
        model.setActiveTickFromExactPosition(33.3333);

        expect(model.options.from).toBe(2);
        expect(model.activeTicks.from).toStrictEqual({
          index: 1,
          tick: {
            position: 33.3333,
            value: 2,
          },
        });
      });

      it('isExactBetween === true', () => {
        model.setIsDouble(true);
        model.setActiveTickFromExactPosition(50);

        expect(model.options.to).toBe(2);
        expect(model.activeTicks.to).toStrictEqual({
          index: 1,
          tick: {
            position: 50,
            value: 2,
          },
        });
      });
    });
  });
});
