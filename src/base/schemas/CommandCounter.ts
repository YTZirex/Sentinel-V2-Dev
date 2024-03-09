import { Schema, model } from "mongoose";

interface CommandCounter {
  global: number;
  logs: {
    logsToggle: {
      used: number;
    };
    logsSet: {
      used: number;
    };
  };
  language: {
    languagePreview: {
      used: number;
    };
    languageSet: {
      used: number;
    };
  };
  account: {
    accountCreate: {
      used: number;
    };
    accountDelete: {
      used: number;
    };
    accountInformations: {
      used: number;
    };
  };
  job: {
    jobInformations: {
      used: number;
    };
    jobChange: {
      used: number;
    };
    jobList: {
      used: number;
    };
    jobDelete: {
      used: number;
    };
  };
  ban: {
    banAdd: {
      used: number;
    };
    banRemove: {
      used: number;
    };
  };
  timeout: {
    timeoutRemove: {
      used: number;
    };
    timeoutAdd: {
      used: number;
    };
  };
  kick: {
    used: number;
  };
  clear: {
    used: number;
  };
  botInfo: {
    used: number;
  };
  profile: {
    used: number;
  };
  serverInfo: {
    used: number;
  };
  userInfo: {
    used: number;
  };
  slowmode: {
    used: number;
  };
  announcement: {
    used: number;
  };
  help: {
    used: number;
  };
  stats: {
    commands: {
      used: number;
    };
  };
  work: {
    used: number;
  };
  avatar: {
    used: number;
  };
  ping: {
    used: number;
  };
  kiss: {
    used: number;
  };
  hug: {
    used: number;
  };
  protection: {
    blacklist: {
      used: number;
    };
    scan: {
      used: number;
    };
    mentions: {
      used: number;
    };
    messages: {
      used: number;
    };
    delete: {
      used: number;
    };
  };
  joke: {
    used: number;
  };
  claimpremium: {
    used: number;
  };
  magicball: {
    used: number;
  };
  games: {
    tictactoe: {
      used: number;
    };
    twozerofoureight: {
      used: number;
    };
    rpc: {
      used: number;
    };
    slots: {
      used: number;
    };
    snake: {
      used: number;
    };
  };
  quote: {
    used: number;
  };
}

export default model<CommandCounter>(
  "CommandCounter",
  new Schema<CommandCounter>({
    global: Number,
    logs: {
      logsToggle: {
        used: Number,
      },
      logsSet: {
        used: Number,
      },
    },
    language: {
      languagePreview: {
        used: Number,
      },
      languageSet: {
        used: Number,
      },
    },
    account: {
      accountCreate: {
        used: Number,
      },
      accountDelete: {
        used: Number,
      },
      accountInformations: {
        used: Number,
      },
    },
    job: {
      jobInformations: {
        used: Number,
      },
      jobChange: {
        used: Number,
      },
      jobList: {
        used: Number,
      },
      jobDelete: {
        used: Number,
      },
    },
    ban: {
      banAdd: {
        used: Number,
      },
      banRemove: {
        used: Number,
      },
    },
    timeout: {
      timeoutRemove: {
        used: Number,
      },
      timeoutAdd: {
        used: Number,
      },
    },
    kick: {
      used: Number,
    },
    clear: {
      used: Number,
    },
    botInfo: {
      used: Number,
    },
    profile: {
      used: Number,
    },
    serverInfo: {
      used: Number,
    },
    userInfo: {
      used: Number,
    },
    slowmode: {
      used: Number,
    },
    announcement: {
      used: Number,
    },
    help: {
      used: Number,
    },
    stats: {
      commands: {
        used: Number,
      },
    },
    work: {
      used: Number,
    },
    avatar: {
      used: Number,
    },
    ping: {
      used: Number,
    },
    kiss: {
      used: Number,
    },
    hug: {
      used: Number,
    },
    protection: {
      blacklist: {
        used: Number,
      },
      scan: {
        used: Number,
      },
      mentions: {
        used: Number,
      },
      messages: {
        used: Number,
      },
      delete: {
        used: Number,
      },
    },
    joke: {
      used: Number,
    },
    claimpremium: {
      used: Number,
    },
    magicball: {
      used: Number,
    },
    games: {
      tictactoe: {
        used: Number,
      },
      twozerofoureight: {
        used: Number,
      },
      rpc: {
        used: Number,
      },
      slots: {
        used: Number,
      },
      snake: {
        used: Number,
      },
    },
    quote: {
      used: Number,
    },
  })
);
