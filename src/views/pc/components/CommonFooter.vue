<template>
  <footer class="p-footer">
    <div class="p-footer-wrapper">
      <el-image
        v-for="(it, idx) in logos"
        :key="idx"
        :src="it"
        class="p-img-logo"
      />
    </div>
    <div class="p-footer-wrapper2">
      <div class="p-brand">
        <a :href="adminConf?.service_logo_link">
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAAwCAMAAACPMqDOAAACtVBMVEUAAAD////////////////////V///b2//f3//j4//m5v/o6P/V6urY6+vb2+3d3e7f3+/S4fDV4/HX5PLZ5vLb2/PT3vTV3+rW4OvY4uvV3e7W3u/X3+/Y4PDS2vDT2+nV3OrW3erX3evR3uvT2uzV2+3V2+3S3e7T3u7V2urV2+rR2+vS3OvT3evU3ezV2ezV2uzR2+3S2+3T3OnU3OnV3erR2erS2urS2+vT2+vU3OvV3OzR3ezS2uzT2+nU2+nV3OrS3OrS2erT2uvT2uvU2+vS2+zS3OzT2ezT2unU2unR2+rS2+rT3OrR2uvS2uvS2+vT2+zT2+nU2enR2erS2urT2+rT2+rR2+vS2evS2evS2uvT2uvT2+nR2+nT2urT2urR2urR2+vS2+vS2+vT2evT2unR2unS2unS2+rS2+rT2erR2erS2urS2uvS2+vT2+vR2enS2enS2unS2urT2urT2+rR2+rS2urT2uvR2uvR2+nS2enS2enS2urT2urR2urS2urS2+rS2erT2erR2uvR2unS2unS2unT2erR2erS2urS2urS2urS2urR2+rR2evS2enS2unS2unS2unR2urR2erS2erS2urR2urS2unS2enS2enS2unR2urS2urS2urS2erR2erR2urS2urS2unS2unS2enR2enR2erS2urS2urS2urR2erR2erS2erS2unS2unR2unR2unS2erS2erS2erS2urR2urS2enS2enR2unR2unS2unS2urS2erS2erR2erR2urS2urS2urS2unR2enR2enR2enS2unS2urS2urR2urS2erS2erS2unR2unR2unR2enS2enS2enS2urR2urR2urS2urS2erS2erR2enR2unR2unS2unS2unS2enR2erR2erR2urS2urS2urR2enYj+ttAAAA5nRSTlMAAQIDBAUGBwgJCgsMDQ4PEBESExQVFxgZGh4fICEiIyQlJicpKistLjAxMjM0NTY3ODk6Ozw9Pj9AQUJDREZHSElKS0xNT1BRUlNUVVdZWltcXV5fYGJjZGVmZ2hpam1ub3BxcnN0dXZ3eHl6fH1+f4CBgoOEhYaIiouMjY6PkJGSk5SVlpeYmZucnZ6foKGio6Slpqeoqaqt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"
            alt=""
            class="p-logo"
          />
        </a>
        <p>ATB 中国由MI平台 (台湾)</p>
        <p>包网团队提供平台技术支持</p>
        <div class="p-huoban">
          <span>商务合作 </span>
          <div class="p-skype">
            <el-image
              src="data:image/png;base64,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"
              fit="contain"
              class="p-hb-img"
              alt="Skype"
            ></el-image>
            <div class="p-last">
              <p class="p-title">Skype</p>
              <div class="p-last-content">
                <p>{{ adminConf?.service_skype }}</p>
                <el-image
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAAMFBMVEUAAABCkf80NDRCk/80NDRFlf9OnP9Ckf9Ckf9Dkf9Ckf9Dkf9KlP////9CkP8zMzNtWmtqAAAADXRSTlMA4+NJSRYM2r3SzMcfR9cGvgAAAHRJREFUOMtjIBsYvoMDGRQJOYTE8wBkiXdIoBSXxMsAFIm7EACSWYZL4nUCDol3bbgkXkAEnf7//48q8Q4ioY9L4j8ZEmDLEWBUYoRIIAGiJORQxB8iJAxRJIThEhCA4FBfAhkQJaGPIv4JIeGEIqHCQCYAALOCWwtH6IqeAAAAAElFTkSuQmCC"
                  fit="contain"
                  alt="copy"
                  class="p-copy-img"
                  @click="copyHandler(adminConf?.service_skype ?? '')"
                />
              </div>
            </div>
          </div>
          <div class="p-skype">
            <el-image
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAABfVBMVEUAAAD///+qqqqZmcyqqqqSkrafn5+OqqqZmbOLoqKJnbGImaqHlqWOnKqGlKGMmaaGkqqLl6KFkKaKlZ+Fj6OJk6eEl6GHj5+GlKGDj6KGkqSCjqCFkaKCk5+Fj5+CkaCEjqKEkqGGkKKEkZ6Gjp+EkKCGkqKDj5+FkaGDj56DjqCFj6GEjp+Ejp6EkKCDj6GCkZ+CkZ+CkKCCj5+Cj56DkJ+Cj6CDkJ6Dj6CEj5+DjqCDkKCEjp+Dj56Ejp+EkJ6Dj5+CkJ+Dj6CCkJ+Cj5+Cjp6CkJ+Cj56Djp+Djp+Dj5+Dj56Dj56Dj5+Dj56Cj5+Dj56Djp6Djp+Cj56Cj5+Dj5+Cj5+Dj56Cjp+Cjp6Cjp6Dj5+Cj5+Dj56Cj56Djp+Djp+Cj5+Dj56Dj5+Djp6Cjp+Cjp+Cjp6Cj56Cj5+Cj5+Djp+Cj56Dj56Cjp+Dj5+Cj5+Djp6Cj56Djp+Cj56Djp+Cjp+Dj56Cjp+Dj56Cjp6Dj5+Cjp6Dj5+Cjp4mODQDAAAAfnRSTlMAAQMFBgcICQoLDQ8REhMUFRYXGBkaGyAmKSorLC0wMzQ2Nzo9Pj9AQUJGSU1PU1RYWl5iZGVmZ2lwcXN4eXp8fYWGh42Rl5manKChpqirsLGztba4ubq7vL7AwcLDxsfJysvN0NfZ293f4eLj6Ons7/Dz9PX29/j5+vv8/f4e0vbmAAADAUlEQVRIx6VXaUMSURQ9ESaFophJUaYVYmJKC2poUCEtTBYR7YIw2UYbQaLDDJ7f3gcWZ2Vx7qeZe9/hXc47c+99gKm5QjGhUCpLUrlUEGIhF/o2bzQnUWNSLurtCzqXkUlFTK4EfB6n0+MLrCRFhZQzcz2h1/NkPR12a73ucLpO5ue7Qie3yFrCYxYaS9TIrUlr7GKFSmrKKjqVUlhZtIpuNJj1d0vMn2VjwzQyJPAw3ouS+CGFIaN7fIfVpd5nsVTlzrhh3x2Wpvs5yekSd/R7Cyx5+5RQiYKOK1an+xXgdJUa1hYbh0v9y3fpsKE6sckK4xjA4qwcqWWLWQxkWW519EzFPxjYr7Ct8zxTGNBSzDcfgqxN9VztXntwSq3zGoMAgAwTvaAzqT3yltqTYAYAJuS6pyvSdUckSd7WfKF12QsgynQ36IVHf1u1aFbjTzMKIMdlS6Tz5keSVMok61pFh5kDXJLitoD6Nv+QJIuz2yR3dQwqkgshFk2RjhuvGiTJg3sjOZJ8qlsgMoQYkybQs/d/tP6p6B8pkiTXdEuSjEFgRI88sfBCbkEPYg7vZzO+gAgFFBjQOkfXv3aKvejHuS/Nx7pTBw6wgBJ9GtUK+x3oQcwB3/fWy66BTpZQploiV+SjHvPpInD+V/tNzxc8LEOiOh/vS6XdnmIO4NLvzk+tGTRASQcGxlbfyq1tMVM+ymPGDKxNu5lQ5HXcAeBaRdUnnWZp6whT2cI/VZPdhRlhhqNqW3Bf3aENfCHAgplImrapae+rhvgKBQt5AnisARv4QpIxhCiag5+T3LPmCyJD1p/kG/Ld6DNLvtyK5AJyDJuCRX4YBu42R5snhnCYuS5l6Nv2aQC4+tOcr2YZsiqA68Otxv2e5GXDiNIsgD1Lr+OhZOS0VXox17PonzlpGG5qnLPfbuw1Olst1l5ztzVW2Bto7I1S9oY4W+OjvcHV3shsc1i3d00AMJ8n6+nl41xQACCYkUmlmIy0r0aRZFEh5UywLxlMHP9SNsB18D+07EzJVG8bZQAAAABJRU5ErkJggg=="
              fit="contain"
              class="p-hb-img"
              alt="Telegram"
            ></el-image>
            <div class="p-last">
              <p class="p-title">Telegram</p>
              <div class="p-last-content">
                <p>{{ adminConf?.service_telegram }}</p>
                <el-image
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAAMFBMVEUAAABCkf80NDRCk/80NDRFlf9OnP9Ckf9Ckf9Dkf9Ckf9Dkf9KlP////9CkP8zMzNtWmtqAAAADXRSTlMA4+NJSRYM2r3SzMcfR9cGvgAAAHRJREFUOMtjIBsYvoMDGRQJOYTE8wBkiXdIoBSXxMsAFIm7EACSWYZL4nUCDol3bbgkXkAEnf7//48q8Q4ioY9L4j8ZEmDLEWBUYoRIIAGiJORQxB8iJAxRJIThEhCA4FBfAhkQJaGPIv4JIeGEIqHCQCYAALOCWwtH6IqeAAAAAElFTkSuQmCC"
                  fit="contain"
                  alt="copy"
                  class="p-copy-img"
                  @click="copyHandler(adminConf?.service_telegram ?? '')"
                />
              </div>
            </div>
          </div>
          <div class="p-skype">
            <el-image
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAABHVBMVEUAAAD///+qqqq/v7+qqqqSkraOqqqZmbOImaqPj5+HlqWGlKGMmaaGkqqLl6KFkKaFj6OJk6eEl6GHj5+Hj6WDkZ+GkqSCk5+CkaCEjqKGjp+EkKCGkqKDj5+FkaGDj56FkaCDj6GDjqCFj6GEjp6EkKCDj6GEkJ+Cj56DkJ+Cj6CDj6CEj5+DkKCDkJ+DkJ+Dj56Ejp+Dj5+Dj6CCkJ+Dj5+Cj5+Cj56Djp+Dj5+Dj56Dj56Cj5+Djp6Cj56Djp+Cj5+Dj56Cjp+Cj5+Dj56Cj56Djp+Djp+Cj5+Dj56Cj5+Djp6Dj56Dj56Cjp+Cj5+Djp+Cj56Dj5+Dj5+Djp+Djp6Cj56Djp+Cjp+Dj56Cjp6Dj5+Cjp6Dj5+Cjp6M137WAAAAXnRSTlMAAQMEBgcJCg8QERMUFRYXGRobICIlKi0zND0+P0BBQkNERklPU1RVZGVma3BzdXd5eoCGh4iNmZygpqmws7a3uru8wsPGx8nKy8zQ09jZ3+Tl5uzu8PP2+fr7/P3+BO4aywAAAqFJREFUSMell1lX4kAQhS+KoKKooKCAMyMCoqKCKBIEXFjEcUFlSSBw///PmAdHpbNoQu4Tp7q+k6T6Ul0NGMobz0rNdkdROu2mlI17YVn+TE2hIKWW8VtCo5UhqbYK+5Ggz+32BSP7hZZKDivRH9FfdXJQTs2L0flUeUDWt79FV0uknPcZLS3lZbK0as7u9qgWA2argaLK3q7Z6tGI1dB3LxaqcnRkuDIncZz7qSS5MaU5fXi5wX7i571I9NlY1j23wXbYyk6G22xony2x7bdooTYlTa3YD1s1YLhPoWq7o3HCun0T49HEjq32mIMN5dj7ckuJVdhSlaVPP1MN2YNDKj98XmcRNlVk/f1HjHLALhyQGQMAVJiHbeVZAYCV4cBnH14aDP0AMixPRl2Ht38NdXvomswrMwOgxuRk8JSmOp3MS7EGeBVV6Dlv5vCb0JlUxYs474SPGZvDYyGxxTiyLAixrRsz9mZLSCwwC4lpTSF37o3Q+x1NWpoSmowIsbMFuPaetejzngsLZ0JihE20GRRi7B57MHvwOom+HszCc9ylkBhkGx2KFiH5kp6B56T7gXZPPJhJv5Ai7GMHCt1amHxKAovnMknK54tA8onUwm4qxjDZ+g2sXQyHF2vAn9b/oA42eO13XW8Cfj+wef0Z0r22rmBfnrjcADYuJ1yjK5h2qwRLPT4KhtNtldYk/EZC4j4lnT0twwVmEWdrOrjFuO4vaRWeVxUvUGNqMiibs7KuGWjb0JU5fKVvQ5oGGHwwYx+C+gaoa73rm4ZaN2q9iE7X9KPOjxtnB52jI9bZ4e5orHA20DgbpZwNcY7GR2eDq7OR2eGw7uyaAGC7Tg7KyWkuKAAQqwxJ9a6Q/rgapQt3KjmsxCzZYGX6S5mN6+A/k3xGzTDxaAUAAAAASUVORK5CYII="
              fit="contain"
              class="p-hb-img"
              alt="Email"
            ></el-image>
            <div class="p-last">
              <p class="p-title">Email</p>
              <div class="p-last-content">
                <p>{{ adminConf?.site_email }}</p>
                <el-image
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAAMFBMVEUAAABCkf80NDRCk/80NDRFlf9OnP9Ckf9Ckf9Dkf9Ckf9Dkf9KlP////9CkP8zMzNtWmtqAAAADXRSTlMA4+NJSRYM2r3SzMcfR9cGvgAAAHRJREFUOMtjIBsYvoMDGRQJOYTE8wBkiXdIoBSXxMsAFIm7EACSWYZL4nUCDol3bbgkXkAEnf7//48q8Q4ioY9L4j8ZEmDLEWBUYoRIIAGiJORQxB8iJAxRJIThEhCA4FBfAhkQJaGPIv4JIeGEIqHCQCYAALOCWwtH6IqeAAAAAElFTkSuQmCC"
                  fit="contain"
                  alt="copy"
                  class="p-copy-img"
                  @click="copyHandler(adminConf?.site_email ?? '')"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="p-brand2">
        <section>
          <el-image :src="mgaImg" class="p-svg"></el-image>
          <p>马耳他牌照（MGA）认证</p>
        </section>
        <section>
          <el-image :src="fscImg" class="p-svg"></el-image>
          <p>英属维尔京群岛（BVI）认证</p>
        </section>
        <section>
          <el-image :src="gcImg" class="p-svg"></el-image>
          <p>英国GC监督委员会</p>
        </section>
        <section>
          <el-image :src="pagImg" class="p-svg"></el-image>
          <p>菲律宾（PAGCOR）监督牌照</p>
        </section>
      </div>

      <div class="p-brand3">
        <a
          v-for="(item, idx) in abouts"
          :key="idx"
          :href="`/aboutUs/${item.id}`"
          >{{ item.title }}</a
        >
      </div>
      <div class="p-brand4">
        <div class="p-one">
          <div class="p-online">
            <el-image
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAB1FBMVEUAAAD///////+qqqq/v7+ZmcyqqqqSkrafn5+OqqqLoqKVlaqImaqHlqWOnKqGlKGMmaaGkqqLl6KFkKaKlZ+Jk6eElZ6IkKGElKWDk6KHj6WHlaODkZ+Gk5+FkaKCkqOFj5+CkqGFj56CkaCHkJ+Ekp+EkZ6Gj6CGjp+Dj5+FkaGFkaCDj6GFkJ+DjqCFkJ6Fj6GDkZ+Fj6CDkKGDj5+EkaGEj6CCkZ+Ej6CEj5+Ejp6Cj5+DkaCCj56EkJ+Dj6CEkJ6Dj5+EkKCEj5+DjqCEj5+DkKCDkJ+Ejp+Ejp+EkJ6Dj5+Dj5+Dj5+Cjp6CjqCCkJ+Dj6CDj5+Cj56Djp+Cj6CDj5+Cjp6Dj56Dj5+Djp+Djp+Djp6Dj5+Dj56Djp6Dj5+Djp+Djp+Dj56Dj5+Cjp+Dj5+Cj5+Cj5+Djp6Cj5+Djp+Dj5+Cj5+Cjp+Cjp6Dj5+Cj5+Dj56Cj56Djp+Cj56Cj5+Dj5+Dj5+Dj5+Djp+Dj56Dj5+Cjp6Dj56Cjp+Cjp+Dj5+Cjp6Djp+Cj5+Cj5+Djp+Djp+Dj5+Cjp+Dj56Cjp+Cjp6Dj5+Djp+Djp6Cj56Djp+Cj56Djp+Cjp+Dj56Dj56Cjp6Dj5+Cjp6Dj5+Cjp7EDtCrAAAAm3RSTlMAAQIDBAUGBwgJCwwPERITFBUWFxgaHR4fISIkJSgsLzAxMjM1ODo7PUBBQ0RFRkdJSktMUFFZWltdX2BhZGprbG1ucHFyc3V4enx9f4CBg4WGiImKi5CRlpianJ6goaOkpaepqqytsLKztLW5ury+wcLDxsfIys3P0dLT1NXW19na297f4eLk5ufo6evs7vLz9PX29/j6+/z9/tf21CQAAAG/SURBVBgZ1cH9XwtxAAfwT20nLeQhFioPI6yhNELIND15Cnl+mkprCYVG6EGzEKV1y+58/lm7+N5rd7vd/eb18n7j/+OuuzGWXF6Yip6phA3pdIKC0luDQqrekEze7TjVcuXZMpnpcsFS/SI5tBd/lIW/ksOlsBBIc74RQMX+4OGdElD2iHxeijzbFpnwouLiNDWp2JEitJN3YFb8knNb3R0ydWM7cJkMwuQE2ShFmUsOFI9wxg2DovfsXzVIo/TBKoUnYXCA3D1As3RtH0dgcI3xJuabaqCyHjnWTbAnSQthme8uSBD8KfIVrczMkbwJYZy2vkNQaQ8CHUCgAwh0AIEOIKgUHta1Pvn0M/WhP+SPUFiCME6hHrqj1MgkeyH4fzDTR8156LqYNemLc2A1dBsbvK6PzPq8GX9VfmNWGM2sgVETNW+3Y0X1BLNmPYh+gVmEmsy9Y7t8xx8o1ARRrXTDzBOnSTcQW9qAPJ6nzKVeBdoYggXXuQXqXu8BWtQorJV3TlKTuOUDvBHGSlBQ+aUXobUA1lxPqz0SCjtL/mo+1Dokc3Qf7IxyxeztWti7T/JxYAscbRpODZbgH/gN2nt2Ojfsq8IAAAAASUVORK5CYII="
              fit="contain"
              class="p-on-img"
            ></el-image>
            <span>在线客服</span>
          </div>
          <div class="p-btn">立即咨询</div>
        </div>
        <div class="p-one">
          <div class="p-online">
            <el-image
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAABYlBMVEUAAAD///////+qqqq/v7+fn5+OqqqSkqSOnKqMmaaLl6KFkKaKlZ+JkqSIkKGHj6WDkKODj6KCjqCCkqOFj5+Fj56EjqKHkJ+Ekp+Gj6GEkZ6EkKGFkJ+FkJ6DkZ+Fj6CEjp+DkKCDj5+Dj5+Dj6GEkJ+CkZ+Ej6CCkKGEjp6Cj5+DkKCCj6CEkJ+EkJ6EkKCEj5+DjqCEjp+EkJ6Dj5+Dj5+Cjp6CjqCDj56Dj6CDj5+Cj56Cj6CCj5+Dj5+Cjp6Cjp+Dj56CkJ+Dj5+Dj5+Djp6Dj56Cjp+Cjp6Cj5+Cj56Djp+Cj5+Cjp+Dj5+Dj5+Cj5+Cj5+Djp+Cj56Djp+Cj56Djp+Dj56Cj5+Dj5+Djp6Cjp6Dj56Cjp+Dj5+Cj5+Djp6Djp+Cj56Djp+Cj56Dj5+Dj56Dj56Dj5+Cj5+Cj5+Cj56Djp+Cjp+Dj56Cjp+Dj56Cjp6Dj5+Cjp6Dj5+Cjp5O3RFiAAAAdXRSTlMAAQIDBAgJDhIUFhcYHB4iJykrLzAyNDU4OTo8RUdIS01OUFJUVVhZXF9gY2ZqbG5wcXh8fX+Bg4SGiImLj5CRlZaXmKKjq6yusLa3uLy/wcLExcbHyMnLzM3O1djZ3N/g4uPk5ebo6uzv8fP29/j5+vv8/f5XEx4VAAABq0lEQVQ4y9WU6z/CYBTHnyndCIVQLhWa5H7LvaiGFEVuEZY7S1Ln/7ed6mNb2/LW78Wz8zznu53z2XPOIeS/yTgUTGRZjmOzieCQUY3SeRJlEKmc8OgUMCrAQoPYACXnbClQVMom5dwcqIhzizl/CVRV8v9ygxXQUGWwzpmfQFNP5hoYhSaKVjlLEZM+wfhn75B75p8fGfiKMwxzIxwWLQgu4FvL5Ihfr8k0mEx3APPkKiI4O9C5gOAh2rNkn1/TxAeE9HAwSZJrZCwUSqMzjmCuASQTVTBcTzKHYEEC0kDa+kkIQYqi3OgsIPgo/6L1oU1vF8BOp3MFnc8IZhpAONYTSehLBLdroIumGQxtBdhC0EHTq+jcRNCBdlgwvaxhBbpH+G2g9XZPKLF2LNG+6h+/QPIln8+X4ZMvWNzyxit/glWVrF2h41v7Bkv2elWsa4Nzv20Q0+IiosLVa5AxaYdNFVS4nRZZd3UxSmVemlFo2N7Yh5y7dymPAMP47rk4hZhRY6roB05r2JuvyQAarnIH1maTahSz8zYfaYt8ay0Z/jD7lu83LORf6geMEzeZC2y50AAAAABJRU5ErkJggg=="
              fit="contain"
              class="p-on-img"
            ></el-image>
            <span> LINE</span>
          </div>
          <div class="p-btn">立即咨询</div>
        </div>
      </div>
    </div>
    <div class="p-footer-wrapper3">
      <p>
        ATB
        中国拥有欧洲马耳他MGA、英国GC监督委员会（GamblingCommission）和菲律宾政府（PAGCOR）颁发的合法执照。注册于英属维尔京群岛，
        是受国际行业协会认可的合法公司。进行注册并娱乐前，请确保您年满18周岁！
      </p>
      <p>版权所有 ©2019-2023 ATB 中国 保留所有权</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { getDomain, invokeApi } from '@/utils/tools'
import { ElMessage } from 'element-plus'
import type { About, AdminConf } from 'typings'
import { onMounted, ref } from 'vue'
import useClipboard from 'vue-clipboard3'

defineOptions({ name: 'PcCommonFooter' })
import mgaImg from '@/assets/web/mga.svg'
import fscImg from '@/assets/web/fsc.svg'
import gcImg from '@/assets/web/gc.svg'
import pagImg from '@/assets/web/pag.svg'

const { toClipboard } = useClipboard()
const logos = ref<string[]>([])
const adminConf = ref<AdminConf>()
const abouts = ref<About[]>()

function copyHandler(t: string) {
  if (t.trim().length > 0) {
    toClipboard(t)
    ElMessage({
      message: '复制成功',
      type: 'success',
    })
  }
}
//获取图片logo
async function getLogos() {
  for (let i = 1; i <= 10; i++) {
    const { default: tmp } = await import(`@/assets/web/footer/${i}.png`)
    logos.value.push(tmp)
  }
}
//获取skpe，line和tg
async function getAdminConfig() {
  const resp = await invokeApi('sysConfig', {
    group: 'admin',
    url: getDomain(),
  })
  if (resp) {
    const data = resp.data as AdminConf
    adminConf.value = data
  }
}

async function getAboutList() {
  const resp = await invokeApi('aboutList')
  if (resp) {
    abouts.value = resp.data as About[]
  }
}
getLogos()

onMounted(async () => {
  await getAdminConfig()
  await getAboutList()
})
</script>

<style lang="less" scoped>
.p-footer {
  width: 100%;
  background: #343d4a;
  color: #828e9e;
  font-size: 14px;
  height: calc(370px / var(--Cardinality));
  text-align: center;
  position: relative;

  &-wrapper {
    max-width: var(--web-max-width);
    min-width: var(--web-min-width);
    width: 100%; //calc(1300px / var(--Cardinality));
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    border-bottom: 1px solid #4e5665;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    margin: 0 auto;

    .p-img-logo {
      margin: calc(16px / var(--Cardinality)) 0 calc(17px / var(--Cardinality))
        0;
      -webkit-transition: all 0.3s;
      transition: all 0.3s;
      height: calc(52px / var(--Cardinality));

      &:hover {
        webkit-filter: brightness(200%);
        filter: brightness(200%);
      }
    }
  }

  &-wrapper2 {
    max-width: var(--web-max-width);
    min-width: var(--web-min-width);
    width: calc(1120px / var(--Cardinality));
    height: calc(194px / var(--Cardinality));
    margin: 0 auto;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    text-align: left;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;

    .p-brand {
      .p-logo {
        margin-bottom: calc(15px / var(--Cardinality));
        width: calc(90px / var(--Cardinality));
        -webkit-transition: all 0.3s;
        transition: all 0.3s;
      }

      .p-huoban {
        display: flex;
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        justify-content: space-between;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        margin-top: 10px;
        font-size: calc(14px / var(--Cardinality));

        .p-skype {
          position: relative;
          &:hover {
            .p-hb-img {
              -webkit-filter: brightness(200%);
              filter: brightness(200%);
            }
            .p-last {
              opacity: 1;
              z-index: 2;
            }
          }
          .p-hb-img {
            vertical-align: middle;
            -webkit-transition: all 0.3s;
            transition: all 0.3s;
            width: 28px;
            cursor: pointer;
          }
          .p-last {
            position: absolute;
            top: calc(28px / var(--Cardinality));
            left: calc(-95px / var(--Cardinality));
            width: calc(200px / var(--Cardinality));
            height: calc(72px / var(--Cardinality));
            background: #f0f2f8;
            -webkit-box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.1);
            box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.1);
            border-radius: 4px;
            -webkit-transition: all 0.5s ease;
            transition: all 0.5s ease;
            padding: 0 calc(10px / var(--Cardinality));
            opacity: 0;

            .p-title {
              text-align: center;
              color: #787e8c;
              font-weight: 700;
              margin: 5px 0;
            }
            .p-last-content {
              height: calc(32px / var(--Cardinality));
              line-height: calc(32px / var(--Cardinality));
              background: #fff;
              margin: 0 auto;
              padding-left: calc(15px / var(--Cardinality));
              position: relative;
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;

              p {
                font-size: 12px;
              }
              .p-copy-img {
                width: 10px;
                height: 10px;
                margin-right: 10px;
                cursor: pointer;
              }
            }
          }
        }
      }
    }

    .p-brand2 {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-wrap: wrap;
      flex-wrap: wrap;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      -webkit-box-pack: justify;
      -ms-flex-pack: justify;
      justify-content: space-between;
      text-align: left;
      width: calc(500px / var(--Cardinality));

      section {
        width: calc(215px / var(--Cardinality));
        text-align: left;
        margin-bottom: calc(8px / var(--Cardinality));

        &:hover {
          .p-svg {
            -webkit-filter: brightness(200%);
            filter: brightness(200%);
          }
          p {
            color: #fff;
          }
        }
        .p-svg {
          -webkit-transition: -webkit-filter 0.3s ease;
          transition: -webkit-filter 0.3s ease;
          transition: filter 0.3s ease;
          transition:
            filter 0.3s ease,
            -webkit-filter 0.3s ease;
          height: calc(50px / var(--Cardinality));
        }
        p {
          padding-left: calc(10px / var(--Cardinality));
          font-size: calc(14px / var(--Cardinality));
        }
      }
    }

    .p-brand3 {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-orient: vertical;
      -webkit-box-direction: normal;
      -ms-flex-direction: column;
      flex-direction: column;

      a {
        color: #828e9e;
        font-size: calc(14px / var(--Cardinality));
        margin-top: calc(5px / var(--Cardinality));
        line-height: 14px;

        &:hover {
          color: #fff;
        }
      }
    }

    .p-brand4 {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-orient: vertical;
      -webkit-box-direction: normal;
      -ms-flex-direction: column;
      flex-direction: column;
      -webkit-box-pack: justify;
      -ms-flex-pack: justify;
      justify-content: flex-start;
      -webkit-box-align: center;
      -ms-flex-align: center;

      .p-online {
        margin-bottom: 5px;
        font-size: 12px;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;

        .p-on-img {
          margin-right: 5px;
          width: calc(20px / var(--Cardinality));
        }
      }
      .p-btn {
        border-radius: 4px;
        border: 1px solid #707684;
        width: calc(84px / var(--Cardinality));
        height: calc(30px / var(--Cardinality));
        line-height: calc(30px / var(--Cardinality));
        text-align: center;
        margin-bottom: calc(10px / var(--Cardinality));
        cursor: pointer;

        &:hover {
          border: 1px solid #fff;
          color: #fff;
        }
      }
    }
  }

  &-wrapper3 {
    max-width: var(--web-max-width);
    min-width: var(--web-min-width);
    width: 100%; //calc(1410px / var(--Cardinality));
    margin: 0 auto;
    font-size: calc(14px / var(--Cardinality));
    line-height: 25px;
  }
}
</style>
