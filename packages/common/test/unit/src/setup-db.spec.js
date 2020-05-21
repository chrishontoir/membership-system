// const assert = require('assert');
// const td = require('testdouble');
// const Emitter = require('events');

// describe('common / setup-db', () => {
//   beforeEach(() => {
//     this.config = {
//       db: {
//         test: 'one'
//       }
//     };
//     this.ctx = {
//       res: new Emitter(),
//       db: {
//         $pool: {
//           end: td.function()
//         }
//       }
//     };
//     this.next = td.function();
//     this.sut = require('../../../src/setup-db');
//   });
//   afterEach(td.reset);

//   describe('when passed a config and a ctx', () => {
//     it.only('should get up the postgres database', async (done) => {
//       // this.response = await this.sut(this.config)(this.ctx, this.next);
//       // console.log(this.response);
//       // // assert.deepStrictEqual(this.ctx, {})
//       // td.verify(await this.next());


//       this.sut(this.config)(this.ctx, this.next).then(async () => {
//         new Promise((resolve, reject) => {
//           setTimeout(() => {
//             this.ctx.res.emit('finish');
//             resolve();
//           }, 200);
//         });

//         td.verify(this.ctx.db.$pool.end())

//         // testPromise.then(() => {
//         //   try {
//         //     td.verify(this.ctx.db.$pool.end());
//         //     done();
//         //   } catch (err) {
//         //     done(err);
//         //   }
//         // });
//       });
//     });
//   });
// });
